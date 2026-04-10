import { MongoClient, ObjectId } from "mongodb";

const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017";
const PORT = 3002;

// --- DB Setup ---
const client = new MongoClient(MONGO_URI);
await client.connect();
const db = client.db("pollclass");
const polls = db.collection("polls");
const votes = db.collection("votes");

// Enforce one vote per voter per poll at the DB level
await votes.createIndex({ pollId: 1, voterId: 1 }, { unique: true });

console.log("Connected to MongoDB");

// --- Types ---
interface PollOption { text: string; votes: number }
interface Poll { _id?: ObjectId; question: string; options: PollOption[]; isOpen: boolean; createdAt: Date }
interface Vote { pollId: ObjectId; voterId: string; optionIndex: number; createdAt: Date }

// --- Helpers ---
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

function pollToDTO(poll: any) {
  const totalVotes = poll.options.reduce((s: number, o: PollOption) => s + o.votes, 0);
  return { ...poll, _id: poll._id.toString(), totalVotes };
}

// --- Server ---
Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const parts = url.pathname.split("/").filter(Boolean);
    // parts: ["api", "polls"] | ["api", "polls", ":id"] | ["api", "polls", ":id", "vote"|"close"]

    // Preflight
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });

    if (parts[0] !== "api" || parts[1] !== "polls") return json({ error: "Not found" }, 404);

    const id = parts[2];
    const action = parts[3];

    // POST /api/polls/:id/vote
    if (req.method === "POST" && id && action === "vote") {
      try {
        const { voterId, optionIndex } = await req.json() as { voterId: string; optionIndex: number };
        if (!voterId || typeof optionIndex !== "number") return json({ error: "Invalid body" }, 400);

        let pollId: ObjectId;
        try { pollId = new ObjectId(id); } catch { return json({ error: "Invalid poll id" }, 400); }

        const poll = await polls.findOne({ _id: pollId }) as Poll | null;
        if (!poll) return json({ error: "Poll not found" }, 404);
        if (!poll.isOpen) return json({ error: "Poll is closed" }, 403);
        if (optionIndex < 0 || optionIndex >= poll.options.length) return json({ error: "Invalid option" }, 400);

        try {
          await votes.insertOne({ pollId, voterId, optionIndex, createdAt: new Date() } as Vote);
        } catch (e: any) {
          if (e.code === 11000) return json({ error: "Already voted" }, 409);
          throw e;
        }

        await polls.updateOne({ _id: pollId }, { $inc: { [`options.${optionIndex}.votes`]: 1 } });
        const updated = await polls.findOne({ _id: pollId });
        return json(pollToDTO(updated));
      } catch (e) {
        return json({ error: "Server error" }, 500);
      }
    }

    // PATCH /api/polls/:id/close
    if (req.method === "PATCH" && id && action === "close") {
      try {
        let pollId: ObjectId;
        try { pollId = new ObjectId(id); } catch { return json({ error: "Invalid poll id" }, 400); }
        const poll = await polls.findOne({ _id: pollId }) as Poll | null;
        if (!poll) return json({ error: "Poll not found" }, 404);
        await polls.updateOne({ _id: pollId }, { $set: { isOpen: !poll.isOpen } });
        const updated = await polls.findOne({ _id: pollId });
        return json(pollToDTO(updated));
      } catch { return json({ error: "Server error" }, 500); }
    }

    // DELETE /api/polls/:id
    if (req.method === "DELETE" && id && !action) {
      try {
        let pollId: ObjectId;
        try { pollId = new ObjectId(id); } catch { return json({ error: "Invalid poll id" }, 400); }
        await polls.deleteOne({ _id: pollId });
        await votes.deleteMany({ pollId });
        return json({ ok: true });
      } catch { return json({ error: "Server error" }, 500); }
    }

    // GET /api/polls/:id
    if (req.method === "GET" && id && !action) {
      try {
        let pollId: ObjectId;
        try { pollId = new ObjectId(id); } catch { return json({ error: "Invalid poll id" }, 400); }
        const poll = await polls.findOne({ _id: pollId });
        if (!poll) return json({ error: "Poll not found" }, 404);
        return json(pollToDTO(poll));
      } catch { return json({ error: "Server error" }, 500); }
    }

    // GET /api/polls
    if (req.method === "GET" && !id) {
      try {
        const all = await polls.find({}).sort({ createdAt: -1 }).toArray();
        return json(all.map(pollToDTO));
      } catch { return json({ error: "Server error" }, 500); }
    }

    // POST /api/polls
    if (req.method === "POST" && !id) {
      try {
        const { question, options } = await req.json() as { question: string; options: string[] };
        if (!question?.trim()) return json({ error: "Question is required" }, 400);
        if (!Array.isArray(options) || options.length < 2 || options.length > 4)
          return json({ error: "2 to 4 options required" }, 400);
        const cleanOptions = options.map(o => o.trim()).filter(Boolean);
        if (cleanOptions.length < 2) return json({ error: "At least 2 non-empty options" }, 400);

        const doc: Poll = {
          question: question.trim(),
          options: cleanOptions.map(text => ({ text, votes: 0 })),
          isOpen: true,
          createdAt: new Date(),
        };
        const result = await polls.insertOne(doc);
        const created = await polls.findOne({ _id: result.insertedId });
        return json(pollToDTO(created), 201);
      } catch { return json({ error: "Server error" }, 500); }
    }

    return json({ error: "Not found" }, 404);
  },
});

console.log(`PollClass backend running on http://localhost:${PORT}`);

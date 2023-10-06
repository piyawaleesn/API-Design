import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const questionsRouter = Router();

//get all
// questionsRouter.get("/", async (req, res) => {
//   const collection = db.collection("questions");

//   const questions = await collection.find().toArray();

//   return res.json({ data: questions });
// });

//get limit
questionsRouter.get("/", async (req, res) => {
  try {
    const limit = Number(req.query.limit);

    if (limit > 100) {
      return res.status(401).json({
        message: "Invalid request, limit must not exceed 100 assignments",
      });
    }

    const category = req.query.category;
    const keywords = req.query.keywords;

    const query = {};

    if (category) {
      query.category = new RegExp(category, "i");
    }

    if (keywords) {
      query.Question_Topic = new RegExp(keywords, "i");
    }

    const collection = db.collection("questions");
    const questions = await collection.find(query).limit(limit).toArray();
    return res.json({
      message: "Complete Fetching questions",
      data: questions,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

//get id
questionsRouter.get("/:id", async (req, res) => {
  try {
    const questionsId = new ObjectId(req.params.id);
    const collection = db.collection("questions");
    const examineQuestions = await collection.findOne({
      _id: questionsId,
    });
    console.log(examineQuestions);

    if (!examineQuestions) {
      return res.status(404).json({
        message: `Questions Id: ${questionsId} not found`,
      });
    }
    const questions = await collection.find({ _id: questionsId }).toArray();
    return res.json({
      message: `Complete Fetching questions Id: ${questionsId}`,
      data: questions,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// create
questionsRouter.post("/", async (req, res) => {
  try {
    const collection = db.collection("questions");
    const questionsData = { ...req.body, created_at: new Date() };
    console.log(req.body);
    await collection.insertOne(questionsData);
    return res.json({
      message: "Questions has been created successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

//edit
questionsRouter.put("/:id", async (req, res) => {
  try {
    const collection = db.collection("questions");
    const questionsId = new ObjectId(req.params.id);
    const examineQuestions = await collection.findOne({
      _id: questionsId,
    });
    console.log(examineQuestions);

    if (!examineQuestions) {
      return res.status(404).json({
        message: `Questions Id: ${questionsId} not found`,
      });
    }
    const newquestionsData = { ...req.body };
    await collection.updateOne(
      {
        _id: questionsId,
      },
      {
        $set: newquestionsData,
      }
    );
    return res.json({
      message: `Questions Id: ${questionsId} has been updated successfully`,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

//delete
questionsRouter.delete("/:id", async (req, res) => {
  try {
    const collection = db.collection("questions");

    const questionsId = new ObjectId(req.params.id);

    const examineQuestions = await collection.findOne({
      _id: questionsId,
    });
    console.log(examineQuestions);

    if (!examineQuestions) {
      return res.status(404).json({
        message: `Questions Id: ${questionsId} not found`,
      });
    }

    await collection.deleteOne({
      _id: questionsId,
    });

    return res.json({
      message: `Questions Id: ${questionsId} has been deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default questionsRouter;

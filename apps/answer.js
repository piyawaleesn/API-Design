import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";
import validateAnswersData from "../Middlewares/questionsValidation.js";

const answersRouter = Router();

//create answer of questions
answersRouter.post("/:id/answers", validateAnswersData, async (req, res) => {
  const collection = db.collection("questions");
  const questionsId = new ObjectId(req.params.id);

  const answersData = {
    id: new ObjectId(),
    ...req.body,
    created_at: new Date(),
  };

  await collection.updateOne(
    {
      _id: questionsId,
    },
    {
      $push: { answers: answersData },
    }
  );

  return res.json({
    message: "New answer has been created successfully",
  });
});

//get answer of questions
answersRouter.get("/:id/answers", async (req, res) => {
  const collection = db.collection("questions");
  const questionsId = new ObjectId(req.params.id);

  const answersData = await collection
    .find({ _id: questionsId }, { projection: { answers: 1 } })
    .toArray();

  return res.json({
    message: "Complete Fetching comments",
    data: answersData,
  });
});
export default answersRouter;

function validateAnswersData(req, res, next) {
  console.log(req.body);
  try {
    const { answers } = req.body;

    if (!answers || answers.length > 300) {
      return res
        .status(400)
        .json({ message: "Answers must not be over 300 characters" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default validateAnswersData;

import Activity from "../models/Activity.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const activities = await Activity.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      user: req.user,
      activities,
    });

  } catch (err) {
    console.error("Dashboard Error:", err);

    res.status(500).json({
      message: "Dashboard failed",
    });
  }
};

const db = require("../config/db");

exports.getRecent = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM transactions ORDER BY created_at DESC LIMIT 5",
      [],
    );
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

import Nyan from "../../../../database/models/Nyan";
import dbconnect from "../../../../database/dbconnect";

const handler = async (req, res) => {
  const { role, username, email, password, firstname, lastname } = req.body;
  await dbconnect();

  const newNyan = new Nyan({
    role,
    username,
    email,
    password,
    firstname,
    lastname,
  });

  try {
    const data = await newNyan.save();
    res
      .status(201)
      .json({ success: true, message: "New account created", id: data._id });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
};

export default handler;

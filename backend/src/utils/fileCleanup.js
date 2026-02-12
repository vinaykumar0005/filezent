import File from "../models/File.js";
import { supabase } from "../config/supabase.js";

export const cleanup = async () => {

  const expired = await File.find({
    expiresAt: { $lt: new Date() }
  });

  for (let file of expired) {

    await supabase
      .storage
      .from("uploads")
      .remove([file.path]);

    await File.deleteOne({ _id: file._id });
  }

};
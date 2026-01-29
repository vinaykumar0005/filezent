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

// old code
// import fs from "fs";
// import File from "../models/File.js";

// /**
//  * Deletes expired files from disk and DB
//  */
// export const startFileCleanup = () => {
//   setInterval(async () => {
//     try {
//       const now = new Date();

//       // Find expired files
//       const expiredFiles = await File.find({
//         expiresAt: { $lt: now },
//       });

//       for (const file of expiredFiles) {
//         // Delete physical file
//         if (file.path && fs.existsSync(file.path)) {
//           fs.unlinkSync(file.path);
//         }

//         // Delete DB record
//         await File.deleteOne({ _id: file._id });
//       }

//       if (expiredFiles.length > 0) {
//         console.log(
//           `🧹 File cleanup: ${expiredFiles.length} expired files deleted`
//         );
//       }
//     } catch (err) {
//       console.warn("⚠️ File cleanup skipped:", err.message);
//     }
//   }, 60 * 60 * 1000); // Run every 1 hour
// };

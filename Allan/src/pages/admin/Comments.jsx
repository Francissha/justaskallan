
import React from "react";
import { comments } from "../../data/comments";
import { CheckCircle, XCircle } from "lucide-react";

const AdminComments = () => {
  return (
    <div className="flex-1 p-8 bg-gray-50">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1B4D3E]">
          Comments
        </h1>

        <p className="text-gray-500 mt-2">
          Manage comments on your blogs.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left">Blog Name</th>
              <th className="px-6 py-4 text-left">Comment</th>
              <th className="px-6 py-4 text-left">Approved</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>

            {comments.map((comment) => (
              <tr
                key={comment._id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-medium">
                  {comment.blogTitle}
                </td>

                <td className="px-6 py-4">
                  {comment.comment}
                </td>

                <td className="px-6 py-4">
                  {comment.approved ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      Approved
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                      Pending
                    </span>
                  )}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-4">

                    <button className="text-green-600 hover:text-green-800">
                      <CheckCircle size={20} />
                    </button>

<button className="text-red-600 hover:text-red-800">
  <XCircle size={20} />
</button>
                  </div>
                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default AdminComments;

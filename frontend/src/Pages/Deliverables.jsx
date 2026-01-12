import { useParams } from "react-router-dom";

export default function Deliverables() {
  const { projectId } = useParams();

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h1 className="text-xl font-semibold mb-2">Deliverables</h1>
      <p className="text-sm text-gray-600">Project ID: {projectId}</p>
    </div>
  );
}

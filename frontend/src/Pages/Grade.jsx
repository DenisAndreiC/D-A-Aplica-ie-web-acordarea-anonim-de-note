import { useParams } from "react-router-dom";

export default function Grade() {
  const { deliverableId } = useParams();

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h1 className="text-xl font-semibold mb-2">Grade</h1>
      <p className="text-sm text-gray-600">Deliverable ID: {deliverableId}</p>
    </div>
  );
}

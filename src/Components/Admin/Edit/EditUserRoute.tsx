import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserEdit from "./UserEdit";
import { getUserById } from "../../../Services/User.Service";
import type { Users } from "../../../Models/user";

const EditUserRoute = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<Users | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const loadUser = async () => {
      try {
        const res = await getUserById(Number(userId));
        setUser(res.data.data);
      } catch {
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId, navigate]);

  if (!user || loading) return null;

  return (
    <UserEdit
      user={user}
      onClose={() => navigate(-1)}
      onSave={() => navigate(-1)}
    />
  );
};

export default EditUserRoute;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCandidateById,
 
} from "../../../Services/User.Service";
import CandidateEdit from "./CandidateEdit";
import type {
  CandidateDto,
  
} from "../../../Models/user";

const CandidateEditRoute = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<CandidateDto | null>(null);
  
  useEffect(() => {
    if (!candidateId) return;

    const loadUser=async()=>{
        try{
            console.log(Number(candidateId));
            const res=await getCandidateById(Number(candidateId));
            
            setCandidate(res);
        } catch{
            navigate(-1);
        }
    }

    loadUser();
  }, [candidateId, navigate]);

 

  if (!candidate) return null;

  return (
    <CandidateEdit
      candidate={candidate}
      onSave={()=>navigate(-1)}
      onClose={() => navigate("..")}
    />
  );
};

export default CandidateEditRoute;

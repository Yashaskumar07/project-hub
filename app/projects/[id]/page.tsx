import { connectToDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import ProjectDetailsClient from "./PorjectDetailsClient";

interface ProjectDetailsProps {
  params: { id: string };
}

export default async function ProjectDetails({ params }: ProjectDetailsProps) {
  const db = await connectToDB();

  if (!ObjectId.isValid(params.id)) {
    notFound();
  }

  const project = await db.collection("projects").findOne({
    _id: new ObjectId(params.id),
  });

  if (!project) {
    notFound();
  }

  return <ProjectDetailsClient project={JSON.parse(JSON.stringify(project))} />;
}

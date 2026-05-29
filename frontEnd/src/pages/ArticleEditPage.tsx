import { useParams } from "react-router-dom";
import { ArticleFormShared } from "./ArticleFormPage";

export default function ArticleEditPage() {
  const { id } = useParams() as { id: string };
  return <ArticleFormShared id={id} />;
}

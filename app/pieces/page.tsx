import { getPieces } from "@/app/actions";
import { AddPieceForm } from "./AddPieceForm";

export const dynamic = "force-dynamic";
import { PieceList } from "./PieceList";
import { EditPieceForm } from "./EditPieceForm";
import type { Piece } from "@/lib/types";

type Props = { searchParams: Promise<{ [key: string]: string | string[] | undefined }> };

export default async function PiecesPage({ searchParams }: Props) {
  const params = await searchParams;
  const editId = typeof params.edit === "string" ? params.edit : null;
  const pieces = await getPieces();
  const pieceToEdit: Piece | null =
    editId ? pieces.find((p) => p.id === editId) ?? null : null;

  return (
    <main style={{ padding: "1.5rem", maxWidth: "42rem" }}>
      <h1 style={{ marginTop: 0 }}>Pieces</h1>

      <section style={sectionStyle}>
        <h2 style={h2Style}>Add piece</h2>
        <AddPieceForm />
      </section>

      {pieceToEdit && (
        <section style={sectionStyle}>
          <h2 style={h2Style}>Edit: {pieceToEdit.title}</h2>
          <EditPieceForm piece={pieceToEdit} />
        </section>
      )}

      <section style={sectionStyle}>
        <h2 style={h2Style}>All pieces</h2>
        <PieceList pieces={pieces} editId={editId} />
      </section>
    </main>
  );
}

const sectionStyle: React.CSSProperties = {
  marginBottom: "2rem",
};

const h2Style: React.CSSProperties = {
  fontSize: "1.1rem",
  fontWeight: 600,
  marginBottom: "0.5rem",
};

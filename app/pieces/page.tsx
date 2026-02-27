import { getPieces } from "@/app/actions";
import { AddPieceForm } from "./AddPieceForm";

export const dynamic = "force-dynamic";
import { PieceList } from "./PieceList";
import { EditPieceForm } from "./EditPieceForm";
import type { Piece } from "@/lib/types";
import styles from "./Pieces.module.css";

type Props = { searchParams: Promise<{ [key: string]: string | string[] | undefined }> };

export default async function PiecesPage({ searchParams }: Props) {
  const params = await searchParams;
  const editId = typeof params.edit === "string" ? params.edit : null;
  const pieces = await getPieces();
  const pieceToEdit: Piece | null =
    editId ? pieces.find((p) => p.id === editId) ?? null : null;

  return (
    <main>
      <h1>Pieces</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Add piece</h2>
        <AddPieceForm />
      </section>

      {pieceToEdit && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Edit: {pieceToEdit.title}</h2>
          <EditPieceForm piece={pieceToEdit} />
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>All pieces</h2>
        <PieceList pieces={pieces} editId={editId} />
      </section>
    </main>
  );
}

import db from "@/lib/db";

(async () => {
  try {
    const project = await db.project.create({
      data: {
        name: "Test Project",
        githubUrl: "https://github.com/your/repo"
      }
    })

    const row = await db.sourceCodeEmbedding.create({
      data: {
        summary: "test summary",
        sourceCode: "code",
        fileName: "file.c",
        projectId: project.id
      }
    })

    console.log("✅ Inserted:", row);
  } catch (e) {
    console.error("❌ Error inserting:", e);
  } finally {
    await db.$disconnect()
  }
})();

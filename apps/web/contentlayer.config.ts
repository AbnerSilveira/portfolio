import { defineDocumentType, makeSource } from "contentlayer2/source-files";

type RawDoc = { _raw: { flattenedPath: string } };

export const Project = defineDocumentType(() => ({
  name: "Project",
  filePathPattern: `projects/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    subject: { type: "string", required: true },
    semester: { type: "string", required: true },
    impact: {
      type: "enum",
      options: ["high", "medium", "low"],
      required: true,
    },
    category: {
      type: "enum",
      options: ["interactive", "sandbox", "video", "documentation"],
      required: true,
    },
    tags: { type: "list", of: { type: "string" }, required: true },
    githubUrl: { type: "string" },
    demoUrl: { type: "string" },
    videoUrl: { type: "string" },
    date: { type: "date", required: true },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc: RawDoc) =>
        doc._raw.flattenedPath.replace(/^projects\//, ""),
    },
  },
}));

const config: ReturnType<typeof makeSource> = makeSource({
  contentDirPath: "content",
  documentTypes: [Project],
});

export default config;

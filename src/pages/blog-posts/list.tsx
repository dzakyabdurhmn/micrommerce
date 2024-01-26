import { IResourceComponentsProps } from "@refinedev/core";
import { MantineListInferencer } from "@refinedev/inferencer/mantine";

export const BlogPostList: React.FC<IResourceComponentsProps> = () => {
  return (
    <MantineListInferencer
      fieldTransformer={(field) => {
        if (["$permissions", "$updatedAt", "$createdAt"].includes(field.key)) {
          return false;
        }
        return field;
      }}
    />
  );
};

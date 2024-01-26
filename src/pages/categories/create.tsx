import { IResourceComponentsProps } from "@refinedev/core";
import { MantineCreateInferencer } from "@refinedev/inferencer/mantine";

export const CategoryCreate: React.FC<IResourceComponentsProps> = () => {
  return (
    <MantineCreateInferencer
      fieldTransformer={(field) => {
        if (["$permissions", "$updatedAt", "$createdAt"].includes(field.key)) {
          return false;
        }
        return field;
      }}
    />
  );
};

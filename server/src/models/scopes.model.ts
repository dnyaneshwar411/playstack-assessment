import { model, Schema } from "mongoose";
import type { InferRawDocTypeFromSchema } from "mongoose"

const scopeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: true
  },
  scopeMap: {
    type: Map,
    of: Boolean
  }
});

const Scope = model("Scope", scopeSchema);

export default Scope;

export type IScope = InferRawDocTypeFromSchema<typeof scopeSchema>;
import { toast } from "sonner"

export const catchAsync = function (fn: Function) {
  Promise.resolve(fn).catch(error => {
    const message = error instanceof Error
      ? error.message || "Something went wrong"
      : "Something went wrong! Stay Tuned."
    toast.error(message);
  })
}

export const buildToastMessage = function (error: any, placeholder: string = "Something went wrong") {
  return error instanceof Error
    ? error.message || placeholder
    : placeholder
}
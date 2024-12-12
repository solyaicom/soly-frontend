import _ from "lodash";
import { FetchError } from "ofetch";

class ErrorHandler {
  error: Error;
  constructor(error: Error) {
    this.error = error;
  }

  isAxiosError = (): boolean => {
    // @ts-expect-error
    return this.error.isAxiosError;
  };

  getMessages = (): string[] => {
    if (!this.isAxiosError()) return [this.error.message];

    const error = this.error as unknown as any;
    if (error instanceof FetchError) return [error.data.message || error.data.response.message];
    if (!error.response) return [error.message];

    const { message } = error.response.data;

    if (message) return [message];

    return [];
  };

  getFieldsErrorMessages = (): Record<string, string[]> => {
    if (!this.isAxiosError()) return {};

    const error = this.error as any;
    if (error instanceof FetchError) {
      return { message: error.data.message || error.data.response.message };
    }

    if (!error.response) return {};

    const errors = error.response.data.errors;
    const output: Record<string, string[]> = {};
    if (Array.isArray(errors)) {
      errors.forEach((e) => {
        if (!output[e.field]) output[e.field] = [];

        output[e.field].push(e.message);
      });
    }

    return output;
  };

  getAllMessages = () => {
    if (this.isAxiosError()) {
      const anyError = this.error as any;

      const status = anyError.response?.data?.status;
      if (status === 500) return [];
    }

    const defaultMessages = this.getMessages();
    const fieldMessages = this.getFieldsErrorMessages();

    const fieldMessagesFlatten = _.flatten(Object.values(fieldMessages));

    return [...defaultMessages, ...fieldMessagesFlatten];
  };

  getAllMessagesString = () => {
    return this.getAllMessages().join("\n");
  };
}

const errorHandler = (error: any) => new ErrorHandler(error);

export function showMessageError(error: any) {
  if (!error) return;

  const handler = errorHandler(error);
  if (!handler.isAxiosError()) {
    const mess = handler.getMessages().join("\n");
    if (!mess) return;

    // Alert.alert('', mess);
    return;
  }

  const anyError = error as any;
  if (!anyError.response) return;

  let mess = anyError?.response?.data?.message;
  const err = anyError?.response?.data?.errors;
  if (mess?.includes("Request")) mess = "";

  if (!mess && err) mess = err[0]?.message;

  if (!mess) return;

  console.log("error mess", mess);

  // SimpleToast.show(mess, SimpleToast.SHORT);
}

export default errorHandler;

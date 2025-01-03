type TErrorSource = {
  path: string | number;
  message: string;
}[];
export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorSources: TErrorSource;
};
export default TErrorSource;

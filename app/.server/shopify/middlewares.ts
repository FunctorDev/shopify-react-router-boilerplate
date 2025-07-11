import type { BasicParams, MiddlewareFunction } from "./types";

export const composeMiddlewares = (...middlewares: MiddlewareFunction[]) => {
  const executeMiddleware = async (
    params: BasicParams,
    request: Request,
    response: Response,
    index: number,
  ): Promise<any> => {
    if (index === middlewares.length) {
      return response;
    }

    const middleware = middlewares[index];

    return middleware(params, request, response, function next() {
      return executeMiddleware(params, request, response, index + 1);
    });
  };

  return async (
    params: BasicParams,
    request: Request,
    response: Response = new Response(),
  ) => {
    return executeMiddleware(params, request, response, 0);
  };
};

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const getCurrentUser = (context) => {
  return context.switchToHttp().getRequest().user;
};
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    return getCurrentUser(context);
  },
);

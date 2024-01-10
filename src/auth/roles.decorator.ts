import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "./auth.guard";

export function AuthRoles(...roles: string[]): MethodDecorator {
    if (!roles?.length) {
        // if no roles set - simply add authorisation
        return applyDecorators(
            UseGuards(JwtAuthGuard),
            ApiBearerAuth(),
            ApiUnauthorizedResponse({ description: 'Unauthorized' }),
        );
    } else {
        // if any role(s) set - add authorisation only for this role(s)
        return applyDecorators(
            SetMetadata('roles', roles),
            UseGuards(JwtAuthGuard),
            ApiBearerAuth(),
            ApiUnauthorizedResponse({ description: 'Unauthorized' }),
        );
    }
}
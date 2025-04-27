import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { HttpException } from '../utils/http-exception';

/**
 * Middleware to validate request data against a Joi schema
 * @param schema Joi validation schema
 * @param property Request property to validate (body, query, params)
 */
export const validate = (schema: Joi.Schema, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (!error) {
      next();
    } else {
      const details = error.details.reduce((acc: Record<string, string>, curr) => {
        const key = curr.path.join('.');
        acc[key] = curr.message;
        return acc;
      }, {});

      next(new HttpException(400, 'Validation error', details));
    }
  };
};

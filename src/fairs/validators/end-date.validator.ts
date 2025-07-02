import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { CreateFairDto } from '../dto/create-fair.dto'

@ValidatorConstraint({ name: 'EndDateValidator', async: false })
export class EndDateValidator implements ValidatorConstraintInterface {
  validate(endDate: Date, args: ValidationArguments) {
    const object = args.object as CreateFairDto
    return endDate >= object.startDate
  }

  defaultMessage(_args?: ValidationArguments): string {
    return 'End date must be after or equal to start date'
  }
}

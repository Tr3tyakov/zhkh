import { UserForm } from '../../../widgets/users/form/UserForm.tsx';
import { UpdateUserHOC } from '../../../widgets/users/hocs/EditUserHOC.tsx';

export const EditUserPage = UpdateUserHOC(UserForm);

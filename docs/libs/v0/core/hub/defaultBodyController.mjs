import '../request/index.mjs';
import { controlBodyAsText } from '../request/bodyController/text.mjs';

const defaultBodyController = controlBodyAsText();

export { defaultBodyController };

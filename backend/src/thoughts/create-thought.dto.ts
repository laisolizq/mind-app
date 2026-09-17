export class CreateThoughtDto {
  text: string;
  timing: 'today' | 'soon' | 'later';
}
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'a-layout',
  imports: [
  ],
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ALayout { }

import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class MakerService {

  private textKey: string;
  private addLevel: boolean;
  private toTreeJson: boolean;
  private toTreeJsonSubject: Subject<boolean>;
  private addLevelSubject: Subject<boolean>;

  constructor() {
    this.addLevel = true;
    this.textKey = 'name';
    this.toTreeJson = false;
    this.toTreeJsonSubject = new Subject();
    this.addLevelSubject = new Subject();
  }

  set TextKey(key: string) {
    this.textKey = key;
  }

  get TextKey(): string {
    return this.textKey;
  }

  toggleAddLevel() {
    this.addLevel = !this.addLevel;
    this.addLevelSubject.next(this.addLevel);
  }

  toggleToTreeJson() {
    this.toTreeJson = !this.toTreeJson;
    this.toTreeJsonSubject.next(this.toTreeJson);
  }

  toTreeJsonSubscribe(): Observable<boolean> {
    return this.toTreeJsonSubject.asObservable();
  }

  addLevelSubscribe(): Observable<boolean> {
    return this.addLevelSubject.asObservable();
  }
}

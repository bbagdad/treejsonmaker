import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { MakerService } from './maker.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private maker: MakerService) {

  }

  public displayJson: string;
  private textKey = 'text';
  private addLevel = true;
  private toTreeJson = !false;

  private subscriptions: Array<Subscription> = [];

  @ViewChild('t')
  private textArea: ElementRef;

  @ViewChild('in')
  private section: ElementRef;

  ngOnInit(): void {
    this.textKey = this.maker.TextKey;
    this.subscriptions.push(
      this.maker.toTreeJsonSubscribe().subscribe((b) => {
        this.toTreeJson = b;
        this.toJson(this.textArea.nativeElement.value);
      })
    );
    this.subscriptions.push(
      this.maker.addLevelSubscribe().subscribe((b) => {
        this.addLevel = b;
        this.toJson(this.textArea.nativeElement.value);
      })
    );

    this.textArea.nativeElement.value = '';
    this.textArea.nativeElement.focus();
  }

  indent(ev: KeyboardEvent, t: any) {
    if (ev.keyCode === 9) {
      ev.preventDefault();
      t.value += '  ';
    }
  }

  startResize(event: DragEvent) {
    const img = new Image();
    event.dataTransfer.setDragImage(img, 0, 0);
  }

  resizeEditor(event: DragEvent) {
    this.section.nativeElement.style.width = `${event.x}px`;
  }

  doReize(event: DragEvent) {
    this.resizeEditor(event);
  }

  toJson(text: string) {
    if (text && text.length > 0 && /[^ ]/g.test(text)) {
      let jsonResult = [];
      const lines = text.split('\n').filter(m => m && m.trim());

      const lastItemByLevel: number[] = [];
      const mappedLines = lines.map((line, index) => {
        const level = Math.floor(((/^(\s*).*$/.exec(line)[1] || []).length / 2) || 0) + 1;

        const obj: any = {
          id: index + 1,
          [this.textKey]: line.trim()
        };
        lastItemByLevel[level] = obj.id;
        if (level === 1) {
          obj.parentId = 0;
        } else {
          obj.parentId = lastItemByLevel[level - 1];
        }

        if (this.addLevel) {
          obj.level = level;
        }

        return obj;
      });

      mappedLines.forEach(line => {
        jsonResult.push(line);
      });

      if (this.toTreeJson) {
        jsonResult = this.toTree(jsonResult);
      }

      this.displayJson = JSON.stringify(jsonResult, null, 4);
    } else {
      this.displayJson = '';
    }
  }

  toTree(list: any[]): any[] {
    if (!list) {
      return [];
    }

    const map = {};
    const roots = [];
    let ii: number;
    let node: any;

    for (ii = 0; ii < list.length; ii += 1) {
      map[list[ii].id] = ii; // initialize the map
      list[ii].children = []; // initialize the children
    }

    for (ii = 0; ii < list.length; ii += 1) {
      node = list[ii];
      if (node.parentId && node.parentId !== '0' && node.parentId !== 0) {
        // if you have dangling branches check that map[node.parentId] exists
        if (list[map[node.parentId]]) {
          list[map[node.parentId]].children.push(node);
        }
      } else {
        roots.push(node);
      }

    }
    return roots;
  }
}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button, ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css',
})
export class ConfirmationDialogComponent {
  @Input() visible: boolean = false;
  @Input() title: string = '';
  @Input() description: string = '';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() visibleChange = new EventEmitter<boolean>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible); // 🔹 necesario para [(visible)]
    this.cancel.emit();
  }
}

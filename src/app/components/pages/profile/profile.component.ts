import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Button, ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { first, last } from 'rxjs';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { UserService } from '../../../shared/services/user.service';
import { GenreService } from '../../../shared/services/genre.service';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ImageModule,
    CommonModule,
    CalendarModule,
    ButtonModule,
    DialogModule,
    ConfirmationDialogComponent,
    DropdownModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  selectedImage?: string;
  showEditForm: boolean = false;
  showConfirmationDialog: boolean = false;
  contentDialog: any = {
    title: '',
    description: '',
    type: '',
  };

  profileForm: FormGroup = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    email: new FormControl(),
    phoneNumber: new FormControl(),
    birthDate: new FormControl(),
    genre: new FormControl(),
  });

  editForm: FormGroup = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    email: new FormControl(),
    phoneNumber: new FormControl(),
    birthDate: new FormControl(),
  });

  constructor(
    private userService: UserService,
    private genreService: GenreService
  ) {}

  ngOnInit(): void {
    this.listGenres();
    this.loadUserProfile(Number(localStorage.getItem('userId')));
  }

  genres: any[] = [];
  listGenres(): void {
    this.genreService.listGenres().subscribe({
      next: (response) => {
        if (response.status_code === 200) {
          this.genres = response.data.map((x) => ({ id: x.id, name: x.genre }));
        }
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.selectedImage = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  editProfile(): void {
    console.log('Profile updated');
  }

  deleteProfile(): void {
    console.log('Profile deleted');
  }

  switchActionDialog(): void {
    if (this.contentDialog.type === 'edit') {
      this.editProfile();
      this.showEditForm = false;
      this.showConfirmationDialog = false;
    } else if (this.contentDialog.type === 'delete') {
      this.deleteProfile();
      this.showConfirmationDialog = false;
    }
  }

  editModal(action: string): void {
    if (action === 'editar') {
      this.showEditForm = true;
      this.contentDialog = {
        title: '¿Está seguro de actualizar los datos?',
        description: '',
        type: 'edit',
      };
    } else if (action === 'eliminar') {
      this.contentDialog = {
        title: '¿Está seguro de eliminar la cuenta?',
        description: 'Todos los datos se eliminarán permanentemente',
        type: 'delete',
      };
      this.showConfirmationDialog = true;
    }
  }

  loadUserProfile(userId: number): void {
    this.userService.findUserById(userId).subscribe({
      next: (response) => {
        if (response.status_code === 200) {
          this.profileForm.controls['firstName'].setValue(
            response.data?.firstName
          );
          this.profileForm.controls['lastName'].setValue(
            response.data?.lastName
          );
          this.profileForm.controls['email'].setValue(response.data?.email);
          this.profileForm.controls['phoneNumber'].setValue(
            response.data?.phoneNumber
          );
          this.profileForm.controls['birthDate'].setValue(
            new Date(response.data?.birthDate || '')
          );
          this.profileForm.controls['genre'].setValue(response.data?.genre.id);
        }
      },
    });
  }
}

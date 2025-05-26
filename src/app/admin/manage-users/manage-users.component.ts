import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedUser: User | null = null;
  isEditing: boolean = false;
  userForm!: FormGroup;
  submitted = false;
  
  // Filters
  searchTerm: string = '';
  roleFilter: string = '';
  sortBy: string = 'fullName';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loadUsers();
    this.initializeForm();
  }

  loadUsers(): void {
    // In a real app, this would come from a service
    this.users = [
      {
        id: 1,
        fullName: 'Nguyễn Admin',
        email: 'admin@bookstore.com',
        phoneNumber: '0987654321',
        role: 'admin',
        address: {
          street: '123 Đường Admin',
          city: 'TP. Hồ Chí Minh',
          district: 'Quận 1',
          postalCode: '70000',
          country: 'Việt Nam'
        }
      },
      {
        id: 2,
        fullName: 'Trần Manager',
        email: 'manager@bookstore.com',
        phoneNumber: '0912345678',
        role: 'manager',
        address: {
          street: '456 Đường Manager',
          city: 'Hà Nội',
          district: 'Ba Đình',
          postalCode: '10000',
          country: 'Việt Nam'
        }
      },
      {
        id: 3,
        fullName: 'Lê User',
        email: 'user1@example.com',
        phoneNumber: '0901234567',
        role: 'user',
        address: {
          street: '789 Đường User',
          city: 'Đà Nẵng',
          district: 'Hải Châu',
          postalCode: '50000',
          country: 'Việt Nam'
        }
      },
      {
        id: 4,
        fullName: 'Phạm Customer',
        email: 'customer@example.com',
        phoneNumber: '0898765432',
        role: 'user',
        address: {
          street: '101 Đường Customer',
          city: 'Cần Thơ',
          district: 'Ninh Kiều',
          postalCode: '90000',
          country: 'Việt Nam'
        }
      },
      {
        id: 5,
        fullName: 'Hoàng Reader',
        email: 'reader@example.com',
        phoneNumber: '0976543210',
        role: 'user',
        address: {
          street: '202 Đường Reader',
          city: 'Huế',
          district: 'Phú Nhuận',
          postalCode: '49000',
          country: 'Việt Nam'
        }
      }
    ];
    
    this.filterUsers();
  }

  filterUsers(): void {
    let filtered = [...this.users];

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.fullName.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term) ||
        (user.phoneNumber && user.phoneNumber.includes(term))
      );
    }

    // Role filter
    if (this.roleFilter) {
      filtered = filtered.filter(user => user.role === this.roleFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      const fieldA = this.getFieldValue(a, this.sortBy);
      const fieldB = this.getFieldValue(b, this.sortBy);
      
      if (fieldA < fieldB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (fieldA > fieldB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    this.filteredUsers = filtered;
  }

  getFieldValue(user: any, field: string): any {
    return user[field];
  }

  initializeForm(): void {
    this.userForm = this.formBuilder.group({
      id: [0],
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.pattern(/^(0[3-9][0-9]{8}|1[89]00[0-9]{6})$/)]],
      role: ['user', Validators.required],
      address: this.formBuilder.group({
        street: [''],
        city: [''],
        district: [''],
        postalCode: [''],
        country: ['Việt Nam']
      })
    });
  }
  
  selectUser(user: User): void {
    this.selectedUser = { ...user };
    this.isEditing = true;
    this.submitted = false;
    
    this.initializeForm();
    this.userForm.patchValue(user);
  }

  createNewUser(): void {
    this.selectedUser = {
      id: 0, // Will be assigned by backend
      fullName: '',
      email: '',
      phoneNumber: '',
      role: 'user',
      address: {
        street: '',
        city: '',
        district: '',
        postalCode: '',
        country: 'Việt Nam'
      }
    };
    this.isEditing = true;
    this.submitted = false;
    
    this.initializeForm();
  }

  saveUser(): void {
    this.submitted = true;
    
    if (this.userForm.invalid) {
      // Mark all fields as touched to trigger validation
      Object.keys(this.userForm.controls).forEach(key => {
        const control = this.userForm.get(key);
        control?.markAsTouched();
      });
      
      // Show validation errors
      console.log('Form is invalid:', this.userForm.errors);
      return;
    }

    const userData = this.userForm.value as User;
    
    // In a real app, you would call a service to save the user
    if (userData.id === 0) {
      // Create new user
      userData.id = this.users.length + 1;
      this.users.push({...userData});
      console.log('Created new user:', userData);
    } else {
      // Update existing user
      const index = this.users.findIndex(u => u.id === userData.id);
      if (index !== -1) {
        this.users[index] = {...userData};
        console.log('Updated user:', userData);
      }
    }

    this.filterUsers();
    this.cancelEdit();
  }

  cancelEdit(): void {
    this.selectedUser = null;
    this.isEditing = false;
    this.submitted = false;
    this.userForm.reset();
  }
  
  // Convenience getter for form fields
  get f() { return this.userForm.controls; }
  
  get addressControls() { return (this.userForm.get('address') as FormGroup).controls; }

  deleteUser(userId: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
      // In a real app, you would call a service to delete the user
      this.users = this.users.filter(u => u.id !== userId);
      this.filterUsers();
      console.log('Deleted user ID:', userId);
    }
  }

  changeRole(user: User, role: 'admin' | 'user' | 'manager'): void {
    // In a real app, you would call a service to update the role
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.users[index].role = role;
      this.filterUsers();
      console.log(`Changed user ${user.id} role to ${role}`);
    }
  }

  getRoleText(role: string | undefined): string {
    switch (role) {
      case 'admin': return 'Quản trị viên';
      case 'manager': return 'Quản lý';
      case 'user': return 'Người dùng';
      default: return 'Không xác định';
    }
  }

  getRoleBadgeClass(role: string | undefined): string {
    switch (role) {
      case 'admin': return 'badge-admin';
      case 'manager': return 'badge-manager';
      case 'user': return 'badge-user';
      default: return '';
    }
  }

  toggleSort(field: string): void {
    if (this.sortBy === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDirection = 'asc';
    }
    this.filterUsers();
  }
}

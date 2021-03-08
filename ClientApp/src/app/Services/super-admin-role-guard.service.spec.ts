import { TestBed } from '@angular/core/testing';

import { SuperAdminRoleGuardService } from './super-admin-role-guard.service';

describe('SuperAdminRoleGuardService', () => {
  let service: SuperAdminRoleGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuperAdminRoleGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

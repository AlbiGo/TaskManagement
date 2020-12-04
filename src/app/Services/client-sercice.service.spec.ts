import { TestBed } from '@angular/core/testing';

import { ClientSerciceService } from './client-sercice.service';

describe('ClientSerciceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClientSerciceService = TestBed.get(ClientSerciceService);
    expect(service).toBeTruthy();
  });
});

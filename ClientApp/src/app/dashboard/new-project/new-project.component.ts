import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  forthFormGroup: FormGroup;
  isEditable = true;
  model : any;
  list = [1];

  saveRequirements(reqData) {
    console.log(reqData);
  }
  saveExpanse(reqData) {
    console.log(reqData);
  }
  saveSprints(reqData)
  {
    console.log(reqData);
  }
  constructor(private _formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['']
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['']
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdctrl: [''],
    });
    this.forthFormGroup = this._formBuilder.group({
      forthctrl: ['']
    });
    this.secondFormGroup = this._formBuilder.group({
      requirements: this._formBuilder.array([this.createEmailFormGroup()])
    });
    this.thirdFormGroup = this._formBuilder.group({
      expenses: this._formBuilder.array([this.createExpanseFormGroup()])
    });
    this.forthFormGroup = this._formBuilder.group({
      sprints: this._formBuilder.array([this.createSprintsForm()])
    });
    // this.createExpanseFormGroup();
    // this.createEmailFormGroup();
    // this.createSprintsForm();
  }



  addExpanseFormControl()
  {
    const emails = this.thirdFormGroup.get('expenses') as FormArray
    emails.push(this.createExpanseFormGroup())
  }
  createExpanseFormGroup():FormGroup {
    return new FormGroup({
      'thirdctrl': new FormControl('')
    })
  }
  save()
  {
    
  }
  removeFormGroup()
  {
    const emails = this.secondFormGroup.get('requirements') as FormArray
    emails.removeAt((emails.length-1))
  }
  public addEmailFormGroup() {
    const emails = this.secondFormGroup.get('requirements') as FormArray
    emails.push(this.createEmailFormGroup())
  }

  private createEmailFormGroup(): FormGroup {
    return new FormGroup({
      'secondCtrl': new FormControl('')
    })
  }

  createSprintsForm():FormGroup {
    return new FormGroup({
      'forthctrl': new FormControl('')
    })
  }

  public addSprintFormGroup() {
    const emails = this.forthFormGroup.get('sprints') as FormArray
    emails.push(this.createSprintsForm())
  }

}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  form: any;
  interfaceForm: any;
  systemData: any = [];
  visible: boolean = false;
  formData: any;
  interfaceData: any = [];
  selectedInterfaceId: any;
  submitAttempt: boolean = false;
  constructor(private formBuilder: FormBuilder) {

    this.form = formBuilder.group({
      'sNo': [undefined],
      'hostName': ['', [Validators.required, Validators.pattern("www.[a-z0-9.-]+\.[a-z]{2,4}$")]],
      'loopBack': ['', [Validators.required, Validators.pattern("^([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$")]]
    });
    this.interfaceForm = formBuilder.group({
      'ifSrNo': [undefined],
      'sNo': [undefined],
      'interfaceName': ['', Validators.required],
      'ipAddress': ['', [Validators.required, Validators.pattern("^([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$")]]
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    if (localStorage.systemData) {
      this.systemData = JSON.parse(localStorage.systemData);
    }
  }

  editRow(data,formType) {
    formType == 'interfaceForm' ?  this.interfaceForm.patchValue(data) :this.form.patchValue(data);
  }

  submit(form) {
    this.submitAttempt = true;
    if (this.form.valid) {
      if (form.sNo) {
        let itemIndex = this.systemData.findIndex(item => item.sNo == form.sNo);
        this.systemData[itemIndex] = form;
      } else {
        form.sNo = this.systemData.length + 1;
        this.systemData.push(form);
      }
      localStorage.setItem('systemData', JSON.stringify(this.systemData));
      this.submitAttempt = false;
      this.form.reset();
      this.loadData();
    }
  }

  submitIfValues(form) {
    this.submitAttempt = true;
    if (this.interfaceForm.valid) {
      if (localStorage.interfaceData) {
        this.interfaceData = JSON.parse(localStorage.interfaceData);
        if (form.ifSrNo) {
          let itemIndex = this.interfaceData.findIndex(item => item.ifSrNo == form.ifSrNo);
          this.interfaceData[itemIndex] = form;
        } else {
          form.ifSrNo = this.interfaceData.length + 1;
          form.sNo = this.selectedInterfaceId;
          this.interfaceData.push(form);
        }
      } else {
        form.ifSrNo = this.interfaceData.length + 1;
        form.sNo = this.selectedInterfaceId;
        this.interfaceData.push(form);
      }

      localStorage.setItem('interfaceData', JSON.stringify(this.interfaceData));
      this.loadInterfaceData(form);
      this.submitAttempt = false;
      this.interfaceForm.reset();
    }
  }

  delete(data,arrayType) {
    let selectedInterface = JSON.parse(localStorage.interfaceData);
    if(arrayType == 'systemData'){
      this.systemData.splice(this.systemData.indexOf(data), 1);
      localStorage.setItem('systemData', JSON.stringify(this.systemData));
      const newArray = selectedInterface.filter(obj => obj.sNo != data.sNo);
      selectedInterface = newArray;
      localStorage.setItem('interfaceData', JSON.stringify(selectedInterface));
      this.loadData();
    }else if(arrayType == 'interfaceData'){
      selectedInterface.splice(this.interfaceData.indexOf(data), 1);
      localStorage.setItem('interfaceData', JSON.stringify(selectedInterface));
      this.loadInterfaceData(data);
    }
  }

  showDetails(data) {
    this.visible = true;
    this.loadInterfaceData(data);
  }

  loadInterfaceData(data) {
    this.selectedInterfaceId = data.sNo;
    let selectedInterface: any = [];
    if (localStorage.interfaceData) {
      this.interfaceData = JSON.parse(localStorage.interfaceData);
      this.interfaceData.forEach(interfaceObj => {
        if (interfaceObj.sNo == data.sNo) {
          selectedInterface.push(interfaceObj);
        }
      });
      this.interfaceData = selectedInterface;
    }
  }

  close() {
    this.visible = false;
    this.submitAttempt = false;
  }
}

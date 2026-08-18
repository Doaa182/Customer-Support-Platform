import { Component, inject, input, OnInit } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-loading-spinner',
  imports: [NgxSpinnerModule],
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.css',
})
export class LoadingSpinner implements OnInit {
  private spinner = inject(NgxSpinnerService);

  message = input('Loading...');

  ngOnInit(): void {
    this.spinner.show();
  }
}

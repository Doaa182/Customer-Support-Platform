import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-theme-toggle',
  imports: [],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.css',
})
export class ThemeToggle implements OnInit {
  isDark = false;

  ngOnInit(): void {
    this.isDark = localStorage.getItem('theme') === 'dark';

    this.applyTheme();
  }

  toggleTheme(): void {
    this.isDark = !this.isDark;

    this.applyTheme();
  }

  private applyTheme(): void {
    document.documentElement.classList.toggle('dark', this.isDark);

    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
  }
}

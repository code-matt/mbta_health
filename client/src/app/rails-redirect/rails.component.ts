import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'rails-redirect',
  template: `
    Redirect from rails router...
  `
})
export class RailsRedirectComponent {
  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    var params: any = this.route.snapshot.queryParams

    if (params.goto == undefined) {
      this.router.navigate(['mbta-network'])
    } else {
      var path = params.goto;
      this.router.navigate([path]);
    }
  }
}

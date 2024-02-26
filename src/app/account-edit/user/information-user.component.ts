import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { registerLocaleData } from '@angular/common';
import localeUk from '@angular/common/locales/uk';
import { serverPath, serverPathPhotoUser, serverPathPhotoFlat, path_logo } from 'src/app/config/server-config';
import { ActivatedRoute, Router } from '@angular/router';
import { animations } from '../../interface/animation';

export const MY_FORMATS = {
  parse: {
    dateInput: 'dd/MM/YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

registerLocaleData(localeUk);
interface UserInfo {
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  surName: string | undefined;
  dob: string | any;
  password: string | undefined;
  agreeAdd: boolean | false;
  user_mail: string | undefined;
  data_create: string | undefined;
  banned: number;
  checked: number;
  data_unban: string | undefined;
  owner: string | undefined;
}
interface UserCont {
  facebook: string | undefined;
  instagram: string | undefined;
  mail: string | undefined;
  email: string | undefined;
  telegram: string | undefined;
  user_id: string | undefined;
  viber: string | undefined;
  phone_alt: 0,
  tell: 0,
}
interface UserParam {
  add_in_flat: boolean | false;
  user_id: '',
};
@Component({
  selector: 'app-information-user',
  templateUrl: './information-user.component.html',
  styleUrls: ['./information-user.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk-UA' },
  ],
  animations: [
    animations.left,
    animations.left1,
    animations.left2,
    animations.left3,
    animations.left4,
    animations.left5,
    animations.swichCard,
  ],
})

export class InformationUserComponent implements OnInit {
  page: any;
  emailCheckCode: any;
  agreeToDel: boolean = false;
  sentCode: boolean = false;


  extractUsernameFromUrl(url: string): string {
    // Ваш регулярний вираз для витягування імені користувача
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:facebook\.com|instagram\.com|telegram\.me)\/([a-zA-Z0-9._]+)/;

    // Витягнути ім'я користувача з посилання
    const match = url.match(regex);

    // Повернути ім'я користувача, якщо знайдено, або пустий рядок
    return match ? match[1] : '';
  }


  path_logo = path_logo;
  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;

  userInfo: UserInfo = {
    agreeAdd: false,
    firstName: '',
    lastName: '',
    email: '',
    surName: '',
    dob: '',
    password: '',
    user_mail: '',
    data_create: '',
    banned: 0,
    checked: 0,
    data_unban: '',
    owner: '',
  };

  userCont: UserCont = {
    facebook: '',
    instagram: '',
    email: '',
    mail: '',
    phone_alt: 0,
    telegram: '',
    tell: 0,
    user_id: '',
    viber: '',
  };

  userParam: UserParam = {
    add_in_flat: false,
    user_id: '',
  };

  loading = false;
  showPassword = false;
  isPasswordVisible = false;
  passwordType = 'password';

  reloadPageWithLoader() {
    this.loading = true;
    setTimeout(() => {
      location.reload();
    }, 1000);
  }

  errorMessage$ = new Subject<string>();
  selectedFile!: File;
  selectedFlatId: any;
  userImg: any;
  disabledPassword: boolean = true;
  disabledEmail: boolean = true;
  emailCheck: number = 0;
  passwordCheck: number = 0;
  checkCode: any;
  statusMessage: string | undefined;
  indexPage: number = 0;

  sendCodeEmail() {
    this.emailCheck = 1;
    // відправити код для підтвердження
  }

  confirmCodeEmail() {
    this.emailCheck = 2;
    this.userInfo.email = '';
    // перевірити та підтвердити код, правильний далі, ні відміна
  }

  sendCodeNewEmail() {
    this.emailCheck = 3;
    // перевірити та підтвердити код, переписуємо пошту
  }

  confirmCodeNewEmail() {
    this.emailCheck = 0;
    this.getInfo();
    // перевірити та підтвердити код, правильний далі, ні відміна
  }

  sendCodePassword() {
    this.passwordCheck = 1;
    // відправити код для підтвердження
  }

  confirmCodePassword() {
    this.passwordCheck = 2;
    this.userInfo.password = '';
    // перевірити та підтвердити код, правильний далі, ні відміна
  }

  sendCodeNewPassword() {
    this.passwordCheck = 0;
    this.getInfo();
  }

  isAccountOpenStatus: boolean = true;
  helpAdd: boolean = false;
  openHelpAdd() {
    this.helpAdd = !this.helpAdd;
  }
  phonePattern = '^[0-9]{10}$';
  startX = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.page = params['indexPage'] || 3;
      this.indexPage = Number(this.page);
    });
    this.getInfo();
  }

  // відправляю event початок свайпу
  onPanStart(event: any): void {
    this.startX = 0;
  }

  // Реалізація обробки завершення панорамування
  onPanEnd(event: any): void {
    const minDeltaX = 100;
    if (Math.abs(event.deltaX) > minDeltaX) {
      if (event.deltaX > 0) {
        this.onSwiped('right');
      } else {
        this.onSwiped('left');
      }
    }
  }
  // оброблюю свайп
  onSwiped(direction: string | undefined) {
    if (direction === 'right') {
      if (this.indexPage !== 0) {
        this.indexPage--;
      } else {
        this.router.navigate(['/user/info']);
      }
    } else {
      if (this.indexPage <= 1) {
        this.indexPage++;
      } else {
        this.router.navigate(['/looking']);
      }
    }
  }

  async getInfo(): Promise<any> {
    const userJson = localStorage.getItem('user');
    if (userJson !== null) {
      this.http.post(serverPath + '/userinfo', JSON.parse(userJson))
        .subscribe((response: any) => {
          // console.log(response)
          this.userImg = response.img[0].img;
          this.userInfo = response.inf;
          this.userCont = response.cont;
          this.userParam = response.parametrs;
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user not found');
    }
  }

  async saveParamsUser(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        this.loading = true;
        // const data = { ...this.userInfo };
        const response: any = await this.http.post(serverPath + '/add/params', { auth: JSON.parse(userJson), add_in_flat: this.userParam.add_in_flat }).toPromise();
        // console.log(response)
        if (response.status === true) {
          this.statusMessage = 'Налаштування збережено';
          setTimeout(() => {
            this.statusMessage = '';
            this.loading = false;
          }, 2000);
        } else {
          this.statusMessage = 'Помилка збереження';
          setTimeout(() => {
            this.statusMessage = '';
            this.loading = false;
          }, 2000);
        }
      } catch (error) {
        console.error(error);
        this.statusMessage = 'Помилка на сервері, повторіть спробу';
        setTimeout(() => { location.reload }, 2000);
      }
    } else {
      console.log('Авторизуйтесь');
    }
  }


  async saveInfoUser(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        this.loading = true;
        const data = { ...this.userInfo };
        const response: any = await this.http.post(serverPath + '/add/user', { auth: JSON.parse(userJson), new: data }).toPromise();
        // console.log(response)
        if (response.status === true) {
          this.statusMessage = 'Персональні дані збережено';
          setTimeout(() => {
            this.indexPage = 1;
            this.statusMessage = '';
            this.loading = false;
          }, 2000);
        } else {
          this.statusMessage = 'Помилка збереження';
          setTimeout(() => {
            this.statusMessage = '';
            this.loading = false;
          }, 2000);
        }
      } catch (error) {
        console.error(error);
        this.statusMessage = 'Помилка на сервері, повторіть спробу';
        setTimeout(() => { location.reload }, 2000);
      }
    } else {
      console.log('Авторизуйтесь');
    }
  }

  async saveInfoCont(): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        this.loading = true;
        const data = this.userCont;
        // console.log(data)
        const response: any = await this.http.post(serverPath + '/add/contacts', { auth: JSON.parse(userJson), new: data }).toPromise();
        // console.log(response)
        if (response.status === true) {
          this.statusMessage = 'Контактні дані збережено';
          setTimeout(() => {
            this.statusMessage = '';
            this.loading = false;
            this.router.navigate(['/user']);
          }, 2000);
        } else {
          this.statusMessage = 'Помилка збереження';
          setTimeout(() => {
            this.statusMessage = '';
            this.loading = false;
          }, 2000);
        }
      } catch (error) {
        console.error(error);
        this.statusMessage = 'Помилка на сервері, повторіть спробу';
        setTimeout(() => { location.reload }, 2000);
      }
    } else {
      console.log('Авторизуйтесь');
    }
  }

  descriptionVisibility: { [key: string]: boolean } = {};
  isDescriptionVisible(key: string): boolean {
    return this.descriptionVisibility[key] || false;
  }

  toggleDescription(key: string): void {
    this.descriptionVisibility[key] = !this.isDescriptionVisible(key);
  }

  clearInfoCont(): void {
    this.userCont = {
      facebook: '',
      instagram: '',
      email: '',
      mail: '',
      phone_alt: 0,
      telegram: '',
      tell: 0,
      user_id: '',
      viber: '',
    };
  }

  logout() {
    localStorage.removeItem('selectedComun');
    localStorage.removeItem('selectedFlatId');
    localStorage.removeItem('selectedFlatName');
    localStorage.removeItem('selectedHouse');
    localStorage.removeItem('houseData');
    localStorage.removeItem('userData');
    localStorage.removeItem('user');
    this.statusMessage = 'Виходимо з аккаунту';
    setTimeout(() => {
      this.statusMessage = '';
      this.reloadPageWithLoader();
      setTimeout(() => {
        this.router.navigate(['/registration']);
      }, 1500);
    }, 1500);
  }

  openCropperDialog(event: Event) {
    // this._dialog.open<CropImgComponent, Event>(CropImgComponent, {
    //   data: event,
    //   width: 400,
    //   disableClose: true
    // }).afterClosed.subscribe((result?: ImgCropperEvent) => {
    //   if (result) {
    //     const blob = this.dataURItoBlob(result.dataURL!);
    //     const formData = new FormData();
    //     formData.append('file', blob, result.name!);
    //     // console.log(formData)
    //     this.setPhoto(formData);
    //   }
    // });
  }

  dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  async setPhoto(formData: any): Promise<void> {
    const userJson = localStorage.getItem('user');
    if (userJson && formData) {
      this.loading = true;
      formData.append('auth', JSON.stringify(JSON.parse(userJson!)));
      const headers = { 'Accept': 'application/json' };
      try {
        const response: any = await this.http.post(serverPath + '/img/uploaduser', formData, { headers }).toPromise();
        console.log(response)
        if (response.status === 'Збережено') {
          this.statusMessage = 'Фото додано';
          this.getInfo();
          setTimeout(() => {
            this.statusMessage = '';
            this.loading = false;
          }, 2000);
        } else {
          this.statusMessage = 'Помилка завантаження';
          setTimeout(() => {
            this.statusMessage = '';
            this.loading = false;
          }, 2000);
        }
      } catch (error) {
        console.error(error);
        this.statusMessage = 'Помилка на сервері, повторіть спробу';
        setTimeout(() => { location.reload }, 2000);
      }
    } else {
      console.log('Авторизуйтесь');
    }
  }

  async deleteAcc(): Promise<void> {
    const userJson = localStorage.getItem('user');
    this.loading = true;
    if (userJson) {
      try {
        const data = this.userCont;
        const response: any = await this.http.post(serverPath + '/add/contacts', { auth: JSON.parse(userJson), new: data }).toPromise();
        // console.log(response)
        if (response.status === true) {
          this.statusMessage = 'Аккаунт видалено';
          localStorage.removeItem('selectedComun');
          localStorage.removeItem('selectedFlatId');
          localStorage.removeItem('selectedFlatName');
          localStorage.removeItem('selectedHouse');
          localStorage.removeItem('houseData');
          localStorage.removeItem('userData');
          localStorage.removeItem('user');
          setTimeout(() => {
            this.statusMessage = '';
            this.loading = false;
            this.router.navigate(['/registration']);
          }, 2000);
        } else {
          this.statusMessage = 'Помилка збереження';
          setTimeout(() => {
            this.statusMessage = '';
            this.loading = false;
          }, 2000);
        }
      } catch (error) {
        console.error(error);
        this.statusMessage = 'Помилка на сервері, повторіть спробу';
        setTimeout(() => { location.reload }, 2000);
      }
    } else {
      console.log('Авторизуйтесь');
    }
  }


  sendCodeForDelAcc() {
    // this.loading = true;
    const data = {
      email: this.userInfo.user_mail,
    };
    this.sentCode = true;

    // try {
    //   // console.log(data);
    //   this.http.post(serverPath + '/registration/', data)
    //     .subscribe((response: any) => {
    //       // console.log(response)
    //       if (response.status === 'На вашу пошту було надіслано код безпеки') {
    //         this.sentCode = true;
    //         this.statusMessage = 'На вашу пошту було надіслано код безпеки.';
    //         setTimeout(() => {
    //           this.statusMessage = '';
    //           this.loading = false;
    //         }, 2000);
    //       } else {
    //         this.sentCode = false;
    //         this.statusMessage = 'Помилка надсилання коду безпеки.';
    //         setTimeout(() => {
    //           location.reload();
    //         }, 2000);
    //       }
    //     });
    // } catch (error) {
    //   this.sentCode = false;
    //   this.errorMessage$.next('Сталася помилка на сервері');
    //   this.statusMessage = 'Сталася помилка на сервері.';
    //   setTimeout(() => {
    //     location.reload();
    //   }, 2000);
    // }
  }



};

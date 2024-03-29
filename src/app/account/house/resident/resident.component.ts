import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SelectedFlatService } from 'src/app/services/selected-flat.service';
import { ChoseSubscribersService } from '../../../services/chose-subscribers.service';
import { serverPath, path_logo, serverPathPhotoUser, serverPathPhotoFlat } from 'src/app/config/server-config';
// переклад календаря
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { AgreeDeleteComponent } from '../agree-h/agree-delete/agree-delete.component';
import { MatDialog } from '@angular/material/dialog';
import { animations } from '../../../interface/animation';

// переклад календаря
export class Rating {
  constructor(
    public ratingComment: string = '',
    public ratingValue: string = '',
    public ratingDate: string = '',
  ) { }
}
interface Subscriber {

  acces_flat_chats: boolean;
  acces_flat_features: boolean;
  acces_agent: boolean;
  acces_comunal_indexes: boolean;
  acces_citizen: boolean;
  acces_agreement: boolean;
  acces_discuss: boolean;
  acces_subs: boolean;
  acces_filling: boolean;
  acces_services: boolean;
  acces_admin: boolean;
  acces_comunal: boolean;
  acces_added: boolean;

  user_id: string;
  firstName: string;
  lastName: string;
  surName: string;
  tell: number;
  photo: string;
  instagram: string;
  telegram: string;
  viber: string;
  facebook: string;

  mail: string;
}
@Component({
  selector: 'app-resident',
  templateUrl: './resident.component.html',
  styleUrls: ['./resident.component.scss'],
  // переклад календаря
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'uk-UA' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS], },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  // переклад календаря

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

export class ResidentComponent implements OnInit {

  rating: Rating = new Rating();
  helpMenu: boolean = false;
  helpInfo: number = 0;
  ratingTenant: number | undefined;
  ratingOwner: number | undefined;
  numberOfReviewsOwner: any;
  reviewsOwner: any;
  page: any;
  card: any;
  menu: any;
  selectMyPage: boolean = false;

  openHelpMenu(helpInfoIndex: number) {
    this.helpInfo = helpInfoIndex;
    this.helpMenu = !this.helpMenu;
  }

  isCopiedMessage!: string;

  // показ карток
  indexMenu: number = 0;
  indexPage: number = 0;
  indexCard: number = 0;

  onClickMenu(indexPage: number) {
    this.indexPage = indexPage;
  }

  path_logo = path_logo;
  serverPath = serverPath;
  serverPathPhotoUser = serverPathPhotoUser;
  serverPathPhotoFlat = serverPathPhotoFlat;
  selectedSubscriber: Subscriber | undefined;
  subscribers: Subscriber[] = [];
  selectedFlatId: string | any;
  loading = false;
  statusMessageChat: any;
  isCopied = false;
  indexPersonMenu: number = 0;
  ownerInfo: any
  ownerPage: boolean = false;
  statusMessage: string | undefined;

  minDate!: string;
  maxDate!: string;

  numberOfReviews: any;
  totalDays: any;
  reviews: any;
  constructor(
    private selectedFlatIdService: SelectedFlatService,
    private http: HttpClient,
    private choseSubscribersService: ChoseSubscribersService,
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private dialog: MatDialog,
  ) {
    this.setMinMaxDate(35);
    this.rating.ratingDate = this.formatDate(new Date());
  }

  setMinMaxDate(daysBeforeToday: number) {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() - daysBeforeToday);

    this.minDate = this.formatDate(minDate);
    this.maxDate = this.formatDate(today);
  }

  formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(params => {
      this.page = params['indexPage'] || 0;
      this.indexPage = Number(this.page);
      this.card = params['indexCard'] || 0;
      this.indexCard = Number(this.card);
    });
    await this.selectFlat();
    await this.selectSubscriber();
    this.getRatingOwner;
  }

  accesCheck() {
    if (this.selectedSubscriber) {
      if (!this.selectedSubscriber.acces_added) {
        this.selectedSubscriber.acces_admin = false;
      }
      if (!this.selectedSubscriber.acces_comunal_indexes) {
        this.selectedSubscriber.acces_comunal = false;
      }
      if (!this.selectedSubscriber.acces_agent) {
        this.selectedSubscriber.acces_agreement = false;
      }
    }
  }

  async selectFlat() {
    this.selectedFlatIdService.selectedFlatId$.subscribe(async selectedFlatId => {
      this.selectedFlatId = selectedFlatId;
      if (this.selectedFlatId) {
        const offs = 0;
        await this.getOwner(selectedFlatId, offs)
        this.getSubs(selectedFlatId, offs).then(() => {
          if (this.subscribers.length > 0) {
            if (this.selectedSubscriber) {
              const foundSubscriber = this.subscribers.find(subscriber => subscriber.user_id === this.selectedSubscriber?.user_id);
              this.selectedSubscriber = foundSubscriber || this.subscribers[0];
            } else {
              this.selectedSubscriber = this.subscribers[0];
            }
          }
        });
      }
    });
  }

  async selectSubscriber() {
    this.choseSubscribersService.selectedSubscriber$.subscribe(async subscriberId => {
      const userData = localStorage.getItem('userData');
      if (subscriberId && userData) {
        const userObject = JSON.parse(userData);
        const user_id = userObject.inf.user_id;
        if (user_id === subscriberId) {
          this.selectMyPage = true;
        } else {
          this.selectMyPage = false;
        }
        const selectedSubscriber = this.subscribers.find(subscriber => subscriber.user_id === subscriberId);
        if (selectedSubscriber) {
          this.selectedSubscriber = selectedSubscriber;
          await this.getRating(selectedSubscriber);
          this.indexCard = 1;
        }
      }
    });
  }

  async getSubs(selectedFlatId: string | any, offs: number): Promise<any> {
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/citizen/get/citizen';
    const data = {
      auth: JSON.parse(userJson!),
      flat_id: selectedFlatId,
      offs: offs,
    };
    try {
      const response = await this.http.post(url, data).toPromise() as any[];
      const newSubscribers: Subscriber[] = response
        .filter(user_id => user_id !== null)
        .map((user_id: any) => ({
          user_id: user_id.user_id,
          firstName: user_id.firstName,
          lastName: user_id.lastName,
          surName: user_id.surName,
          mail: user_id.mail,
          tell: user_id.tell,
          photo: user_id.img,
          instagram: user_id.instagram,
          telegram: user_id.telegram,
          viber: user_id.viber,
          facebook: user_id.facebook,
          acces_services: user_id.acces_services,
          acces_admin: user_id.acces_admin,
          acces_comunal: user_id.acces_comunal,
          acces_added: user_id.acces_added,
          acces_filling: user_id.acces_filling,
          acces_subs: user_id.acces_subs,
          acces_discuss: user_id.acces_discuss,
          acces_agreement: user_id.acces_agreement,
          acces_citizen: user_id.acces_citizen,
          acces_comunal_indexes: user_id.acces_comunal_indexes,
          acces_agent: user_id.acces_agent,
          acces_flat_features: user_id.acces_flat_features,
          acces_flat_chats: user_id.acces_flat_chats,
        }));
      this.subscribers = newSubscribers;
    } catch (error) {
      console.error(error);
    }
    if (!this.selectedSubscriber) {
      const selectedSubscriberId = localStorage.getItem('selectedSubscriber');
      const selectedSubscriber = this.subscribers.find(subscriber => subscriber.user_id === selectedSubscriberId);
      if (selectedSubscriber) {
        this.selectedSubscriber = selectedSubscriber;
      }
    }
  }

  async getOwner(selectedFlatId: any, offs: number): Promise<any> {
    const userData = localStorage.getItem('userData');
    const userJson = localStorage.getItem('user');
    if (userJson && userData) {
      const userObject = JSON.parse(userData);
      const user_id = userObject.inf.user_id;
      const data = {
        auth: JSON.parse(userJson!),
        user_id: user_id,
        flat_id: selectedFlatId,
        offs: offs,
      };
      try {
        const response = await this.http.post(serverPath + '/citizen/get/ycitizen', data).toPromise() as any[];
        const ownerInfo = response.find(item => item.flat.flat_id.toString() === selectedFlatId)?.owner;
        if (ownerInfo) {
          if (user_id === ownerInfo.user_id) {
            this.ownerPage = false;
          } else {
            this.ownerPage = true;
            this.ownerInfo = ownerInfo;
            this.getRatingOwner(this.ownerInfo.user_id)
          }
        } else {
          this.ownerPage = false;
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  createChat(selectedSubscriber: any): void {
    const selectedFlat = this.selectedFlatId;
    const userJson = localStorage.getItem('user');
    if (userJson && selectedSubscriber) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: selectedFlat,
        user_id: selectedSubscriber.user_id,
      };
      this.http.post(serverPath + '/chat/add/chatFlat', data)
        .subscribe((response: any) => {
          // console.log(response)
          if (response.status !== false) {
            setTimeout(() => {
              this.statusMessage = 'Чат створено, переходимо до чату';
              setTimeout(() => {
                this.router.navigate(['/chat']);
                this.statusMessage = '';
              }, 2000);
            }, 200);
          } else {
            setTimeout(() => {
              this.statusMessage = 'Чат вже існує';
              setTimeout(() => {
                this.statusMessage = '';
              }, 2000);
            }, 200);
          }
        }, (error: any) => {
          console.error(error);
        });
    } else {
      console.log('user or subscriber not found');
    }
  }

  addAccess(subscriber: any): void {
    this.loading = true;
    const userJson = localStorage.getItem('user');
    if (userJson && subscriber) {

      if (!this.selectedSubscriber?.acces_added) {
        this.selectedSubscriber!.acces_admin = false;
      }
      const data = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        user_id: subscriber.user_id,
        acces_added: this.selectedSubscriber?.acces_added,
        acces_admin: this.selectedSubscriber?.acces_admin,
        acces_services: this.selectedSubscriber?.acces_services,
        acces_filling: this.selectedSubscriber?.acces_filling,
        acces_comunal: this.selectedSubscriber?.acces_comunal,
        acces_subs: this.selectedSubscriber?.acces_subs,
        acces_discuss: this.selectedSubscriber?.acces_discuss,
        acces_agreement: this.selectedSubscriber?.acces_agreement,
        acces_citizen: this.selectedSubscriber?.acces_citizen,
        acces_comunal_indexes: this.selectedSubscriber?.acces_comunal_indexes,
        acces_agent: this.selectedSubscriber?.acces_agent,
        acces_flat_features: this.selectedSubscriber?.acces_flat_features,
        acces_flat_chats: this.selectedSubscriber?.acces_flat_chats,
      };
      this.http.post(serverPath + '/citizen/add/access', data).subscribe(
        (response: any) => {
          if (response.status == ')') {
            this.statusMessage = 'Зміни внесено';
            setTimeout(() => {
              this.statusMessage = 'Орендар має перезайти в оселю';
              setTimeout(() => {
                this.statusMessage = 'Після цього зміни втуплять в силу';
                setTimeout(() => {
                  this.statusMessage = '';
                  this.loading = false;
                }, 1500);
              }, 1500);
            }, 1500);
          } else {
            setTimeout(() => {
              this.statusMessage = 'Помилка збереження';
              setTimeout(() => {
                this.statusMessage = '';
                location.reload();
              }, 1500);
            }, 500);
          }
        },
      );
    } else {
      console.log('Авторизуйтесь');
    }
  }

  sendRating(selectedSubscriber: any) {
    const userJson = localStorage.getItem('user');
    const formattedDate = this.datePipe.transform(this.rating.ratingDate, 'yyyy-MM-dd');
    if (userJson && selectedSubscriber) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        user_id: selectedSubscriber.user_id,
        date: formattedDate,
        about: this.rating.ratingComment,
        mark: this.rating.ratingValue,
      };

      this.http.post(serverPath + '/rating/add/userRating', data).subscribe((response: any) => {
        let setMark = this.rating.ratingValue.toString();
        if (response.status === true && setMark === '5') {
          setTimeout(() => {
            this.statusMessage = 'Дякуємо за підтримку гарних людей';
            setTimeout(() => {
              this.statusMessage = 'Відгук збережено!';
              setTimeout(() => {
                this.statusMessage = '';
              }, 2000);
            }, 2000);
          }, 200);
        }

        else if (response.status === true && setMark === '4') {
          setTimeout(() => {
            this.statusMessage = 'Добрі стосунки це важливо';
            setTimeout(() => {
              this.statusMessage = 'Відгук збережено, дякуємо!';
              setTimeout(() => {
                this.statusMessage = '';
              }, 2000);
            }, 2000);
          }, 200);
        }

        else if (response.status === true && setMark === '3') {
          setTimeout(() => {
            this.statusMessage = 'Стабільність це добре';
            setTimeout(() => {
              this.statusMessage = 'Відгук збережено, дякуємо!';
              setTimeout(() => {
                this.statusMessage = '';
              }, 2000);
            }, 2000);
          }, 200);
        }

        else if (response.status === true && setMark === '2') {
          setTimeout(() => {
            this.statusMessage = 'Йой, сподіваємось все налагодиться';
            setTimeout(() => {
              this.statusMessage = 'Відгук збережено!';
              setTimeout(() => {
                this.statusMessage = '';
              }, 2000);
            }, 2000);
          }, 200);
        }

        else if (response.status === true && setMark === '1') {
          setTimeout(() => {
            this.statusMessage = 'Напевно є не закриті питання';
            setTimeout(() => {
              this.statusMessage = 'Відгук збережено!';
              setTimeout(() => {
                this.statusMessage = '';
              }, 2000);
            }, 2000);
          }, 200);
        }

        else {
          setTimeout(() => {
            this.statusMessage = 'Помилка збереження';
            setTimeout(() => {
              this.statusMessage = '';
            }, 2000);
          }, 200);
        }

        this.indexPersonMenu = 0;
        this.rating.ratingComment = '';

      }, (error: any) => {
        console.error(error);
      });
    } else {
      console.log('user or subscriber not found');
    }
  }

  sendRatingOwner(owner: any) {
    // console.log(owner)
    const userJson = localStorage.getItem('user');
    const formattedDate = this.datePipe.transform(this.rating.ratingDate, 'yyyy-MM-dd');
    if (userJson) {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        user_id: owner.user_id,
        date: formattedDate,
        about: this.rating.ratingComment,
        mark: this.rating.ratingValue
      };

      // console.log(data)

      this.http.post(serverPath + '/rating/add/flatrating', data).subscribe((response: any) => {
        let setMark = this.rating.ratingValue.toString();
        // console.log(response)

        if (response.status === true && setMark === '5') {

          setTimeout(() => {
            this.statusMessage = 'Дякуємо за підтримку гарних людей';
            setTimeout(() => {
              this.statusMessage = 'Відгук збережено!';
              setTimeout(() => {
                this.statusMessage = '';
              }, 2000);
            }, 2000);
          }, 200);
        }

        else if (response.status === true && setMark === '4') {
          setTimeout(() => {
            this.statusMessage = 'Добрі стосунки це важливо';
            setTimeout(() => {
              this.statusMessage = 'Відгук збережено, дякуємо!';
              setTimeout(() => {
                this.statusMessage = '';
              }, 2000);
            }, 2000);
          }, 200);
        }

        else if (response.status === true && setMark === '3') {
          setTimeout(() => {
            this.statusMessage = 'Стабільність це добре';
            setTimeout(() => {
              this.statusMessage = 'Відгук збережено, дякуємо!';
              setTimeout(() => {
                this.statusMessage = '';
              }, 2000);
            }, 2000);
          }, 200);
        }

        else if (response.status === true && setMark === '2') {
          setTimeout(() => {
            this.statusMessage = 'Йой, сподіваємось все налагодиться';
            setTimeout(() => {
              this.statusMessage = 'Відгук збережено!';
              setTimeout(() => {
                this.statusMessage = '';
              }, 2000);
            }, 2000);
          }, 200);
        }

        else if (response.status === true && setMark === '1') {
          setTimeout(() => {
            this.statusMessage = 'Напевно є не закриті питання';
            setTimeout(() => {
              this.statusMessage = 'Відгук збережено!';
              setTimeout(() => {
                this.statusMessage = '';
              }, 2000);
            }, 2000);
          }, 200);
        }

        else {
          setTimeout(() => {
            this.statusMessage = 'Помилка збереження';
            setTimeout(() => {
              this.statusMessage = '';
            }, 2000);
          }, 200);
        }

        this.indexPersonMenu = 0;
        this.rating.ratingComment = '';

      }, (error: any) => {
        console.error(error);
      });
    } else {
      console.log('Авторизуйтесь');
    }
  }

  async getRating(selectedUser: any): Promise<any> {
    // console.log(selectedUser);
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/rating/get/userMarks';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: selectedUser.user_id,
    };

    try {
      const response = await this.http.post(url, data).toPromise() as any;
      // console.log(response);

      this.reviews = response.status;
      // console.log(this.reviews);
      if (response && Array.isArray(response.status)) {
        let totalMarkTenant = 0;
        this.numberOfReviews = response.status.length;
        response.status.forEach((item: any) => {
          if (item.info.mark) {
            totalMarkTenant += item.info.mark;
            this.ratingTenant = totalMarkTenant;
            // console.log(this.ratingTenant);
          }
        });
        // console.log('Кількість відгуків:', this.numberOfReviews);
      } else if (response.status === false) {
        this.ratingTenant = 0;
      }
      console.log(this.ratingTenant)
    } catch (error) {
      console.error(error);
    }
  }

  // отримую рейтинг власника оселі
  async getRatingOwner(user_id: any): Promise<any> {
    // console.log(user_id)
    const userJson = localStorage.getItem('user');
    const url = serverPath + '/rating/get/ownerMarks';
    const data = {
      auth: JSON.parse(userJson!),
      user_id: user_id,
    };

    try {
      const response: any = await this.http.post(url, data).toPromise() as any[];
      this.numberOfReviewsOwner = response.status.length;
      this.reviewsOwner = response.status;
      if (this.reviewsOwner && Array.isArray(this.reviewsOwner)) {
        let totalMarkOwner = 0;
        this.reviewsOwner.forEach((item: any) => {
          if (item.info.mark) {
            totalMarkOwner += item.info.mark;
            this.ratingOwner = totalMarkOwner;
          }
        });
      } else {
        this.numberOfReviews = 0;
        this.ratingOwner = 0;
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Копіювання параметрів
  copyToClipboard(textToCopy: string, message: string) {
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          this.isCopiedMessage = message;
          setTimeout(() => {
            this.isCopiedMessage = '';
          }, 2000);
        })
        .catch((error) => {
          this.isCopiedMessage = '';
        });
    }
  }

  copyId(copyId: any) {
    if (copyId)
      this.copyToClipboard(copyId, 'ID скопійовано');
  }

  copyTell(copyTell: any) {
    if (copyTell)
      this.copyToClipboard(copyTell, 'Телефон скопійовано');
  }

  copyMail(copyMail: any) {
    if (copyMail)
      this.copyToClipboard(copyMail, 'Пошту скопійовано');
  }

  copyViber(copyViber: any) {
    if (copyViber)
      this.copyToClipboard(copyViber, 'Viber номер скопійовано');
  }

  // Відправка скарги на орендара, через сервіс
  async reportUser(user: any): Promise<void> {
    this.sharedService.reportUser(user);
    this.sharedService.getReportResultSubject().subscribe(result => {
      if (result.status === true) {
        this.statusMessage = 'Скаргу надіслано'; setTimeout(() => { this.statusMessage = ''; }, 2000);
      } else { this.statusMessage = 'Помилка'; setTimeout(() => { this.statusMessage = ''; }, 2000); }
    });
  }

  // Видаляю з оселі
  removeUser(subscriber: any): void {
    const userJson = localStorage.getItem('user');
    const userData = localStorage.getItem('userData');
    if (!userJson || !userData) { console.log('Авторизуйтесь'); return; }
    const userObject = JSON.parse(userData);
    const userId = userObject.inf.user_id;
    const dialogRef = this.dialog.open(AgreeDeleteComponent, {
      data: {
        flatId: this.selectedFlatId,
        subscriberId: subscriber.user_id,
        subscriber_firstName: subscriber.firstName,
        subscriber_lastName: subscriber.lastName,
        offer: 3,
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      const data = {
        auth: JSON.parse(userJson),
        flat_id: this.selectedFlatId,
        user_id: subscriber.user_id
      };

      if (result === true) {
        this.loading = true;
        if (userId !== subscriber.user_id) {
          this.removeResident(data);
        } else { this.leaveHouse(data); }
      }
    });
  }

  // Видаляю мешканця
  removeResident(data: any): void {
    this.statusMessage = 'Видаляємо мешканця';
    this.http.post(serverPath + '/citizen/delete/citizen', data).subscribe(() => { this.updateSubscriberList(); },
      (error: any) => { console.error('Error deleting subscriber:', error); });
  }

  // Видаляюсь з оселі
  leaveHouse(data: any): void {
    this.statusMessage = 'Видаляємось з оселі';
    this.http.post(serverPath + '/citizen/delete/citizen', data).subscribe(
      () => { },
      (error: any) => {
        console.error('Error deleting user:', error);
      }
    );
    setTimeout(() => {
      this.statusMessage = 'Видаляємо дані оселі';
      this.clearLocalStorage();
      location.reload();
      setTimeout(() => {
        this.selectedFlatIdService.clearSelectedFlatId();
        this.router.navigate(['/user/info']);
      }, 2000);
    }, 1500);
  }

  // Оновлюю список мешканців
  updateSubscriberList(): void {
    setTimeout(() => {
      this.statusMessage = 'Оновлюємо список мешканців';
      this.selectedSubscriber = undefined;
      setTimeout(() => {
        this.getSubs(this.selectedFlatId, 0);
        this.statusMessage = '';
        this.loading = false;
      }, 1000);
    }, 1000);
  }

  // Якщо видаляюсь з оселі очищую всі дані оселі
  clearLocalStorage(): void {
    localStorage.removeItem('house');
    localStorage.removeItem('selectedFlatId');
    localStorage.removeItem('selectedComun');
    localStorage.removeItem('selectedFlatName');
    localStorage.removeItem('selectedHouse');
    localStorage.removeItem('houseData');
  }



}


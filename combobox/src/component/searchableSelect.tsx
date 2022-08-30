import { h } from 'cary-tsx-dom';

export interface selectOptionData {
  value: string
  displayName: string
}

export interface SearchableSelectConfiguration {
  data: selectOptionData[]
  defaultData?: selectOptionData
}

enum KeyCode {
  Esc = 'Escape',
  Down = 'ArrowDown',
  Up = 'ArrowUp',
  Right = 'ArrowRight',
  Left = 'ArrowLeft',
  Enter = 'Enter',
}

export class SearchableSelect {
  // HTMLElement
  private _domContainer: HTMLDivElement;
  private _searchInputContainer: HTMLSpanElement | undefined;
  private _searchInput: HTMLInputElement | undefined;
  private _container: HTMLDivElement;
  private _selectOptionsContainer: HTMLDivElement | undefined;
  private _optionDoms: HTMLElement[] | undefined;
  private _userInputElement: HTMLInputElement;

  // Data
  private _configuration: SearchableSelectConfiguration;
  private _filteredOptionsData: selectOptionData[] | undefined;
  private _selectedItem: selectOptionData | undefined;
  private _currentActiveItem: selectOptionData | undefined;
  private _removeDomTimeout: any;

  constructor(userInputElement: HTMLInputElement, configuration: SearchableSelectConfiguration) {
    this._configuration = configuration;
    this._userInputElement = userInputElement;
    this._domContainer = <div class="gc-searchable-select-dom"></div> as HTMLDivElement;
    this._container = <div tabIndex={this._userInputElement.tabIndex || -1} class="gc-searchable-select-container">
    {this._domContainer}
  </div> as HTMLDivElement;
    this.generateDom();
    this.attachEvent();
    this.setDefaultData();
    this.refreshOptions();
  }

  private setDefaultData() {
    if (!this._configuration.defaultData) {
      return;
    }
    this._selectedItem = this._configuration.defaultData;
    this._searchInput!.value = this._selectedItem.displayName;
    this._userInputElement.value = this._selectedItem.value;
  }

  private generateDom() {
    this._userInputElement.parentElement!.insertBefore(this._container, this._userInputElement);
    this._userInputElement.setAttribute('hidden', 'hidden');
    this._userInputElement.value = '';

    this._searchInput = <input autocomplete="do-not-autofill" id={`__inner__${new Date().getMilliseconds()}`} name={`__inner__${new Date().getMilliseconds()}`} class={`gc-searchable-search-input ${this._userInputElement.classList}`} placeholder={this._userInputElement.placeholder}></input> as HTMLInputElement;

    this._searchInputContainer = <span class="gc-searchable-search-input-container">{this._searchInput}</span>;
    this._domContainer.appendChild(this._searchInputContainer);

    this._selectOptionsContainer = <div class="gc-searchable-search-result-container" style={`width: ${this._searchInput.offsetWidth - 2}px; top: ${this._searchInput.offsetHeight}px`}></div> as HTMLDivElement;
  }

  private refreshOptions() {
    this._selectOptionsContainer!.innerHTML = '';
    this._filteredOptionsData = this._configuration.data.filter(x => x.displayName.includes(this._searchInput!.value)).sort((a, b) => a.displayName.length - b.displayName.length);
    this._optionDoms = [];
    this._filteredOptionsData.forEach((item, index) => {
      const selectItem = <div class={`gc-searchable-search-item ${this._currentActiveItem?.value === item.value ? 'active' : ''}`} data-displayName={item.displayName} data-value={item.value}>{item.displayName}</div>;
      selectItem.addEventListener('click', () => {
        this.selectOption(index);
        this.removeSearchableContainer();
        this.setSelectedValue();
      });
      this._optionDoms?.push(selectItem);
      this._selectOptionsContainer!.appendChild(selectItem);
    });
  }

  private attachEvent() {
    this.attachInputEvent();
  }

  private setSelectedValue() {
    this._selectedItem = this._currentActiveItem;
    if (this._currentActiveItem === undefined) {
      this._userInputElement.value = '';
      this._searchInput!.value = '';
    } else {
      this._userInputElement.value = this._selectedItem!.value;
      this._searchInput!.value = this._selectedItem!.displayName;
    }
    this.refreshOptions();
  }

  private removeSearchableContainer() {
    this._searchInput?.classList.remove('active');
    this._selectOptionsContainer?.classList.remove('show');
    this._removeDomTimeout = setTimeout(() => {
      this._domContainer!.removeChild(this._selectOptionsContainer!);
    }, 300);
  }

  private attachInputEvent() {
    this._searchInput?.addEventListener('focus', () => {
      clearTimeout(this._removeDomTimeout);
      this._domContainer!.appendChild(this._selectOptionsContainer!);
      setTimeout(() => {
        this._searchInput?.classList.add('active');
        this._selectOptionsContainer?.classList.add('show');
      }, 300);
    });

    this._container.addEventListener('focusout', (e) => {
      const focusOutElement = e.relatedTarget as HTMLElement;
      if (focusOutElement === null) {
        this.removeSearchableContainer();
        return;
      }
      if (this._container.contains(focusOutElement) || focusOutElement.classList.contains('gc-searchable-select-container')) {
        return;
      }
      this.removeSearchableContainer();
      this.setSelectedValue();
    });

    this._searchInput?.addEventListener('input', () => {
      this.refreshOptions();
      this.selectDefault();
    });

    this._searchInput?.addEventListener('keydown', (evt) => {
      if (!this._container!.contains(evt.target as HTMLElement)) {
        return;
      }
      switch (evt.key) {
        case KeyCode.Esc:
          this._searchInput?.blur();
          this.refreshOptions();
          break;
        case KeyCode.Up:
          evt.preventDefault();
          evt.stopPropagation();
          this.selectPrevOption();
          break;
        case KeyCode.Down:
          evt.preventDefault();
          evt.stopPropagation();
          this.selectNextOption();
          break;
        case KeyCode.Enter:
          this._searchInput?.blur();
          this.removeSearchableContainer();
          this.setSelectedValue();
          break;
      }
    });
  }

  private selectDefault() {
    this.selectOption(0);
  }

  private selectNextOption() {
    const selected = this._optionDoms?.find(x => x.classList.contains('active'));
    if (selected) {
      const selectedIndex = this._optionDoms?.indexOf(selected);
      if (selectedIndex === this._optionDoms!.length - 1) {
        this.selectOption(0);
      } else {
        this.selectOption(selectedIndex! + 1);
      }
    } else {
      this.selectOption(0);
    }
  }

  private selectPrevOption() {
    const selected = this._optionDoms?.find(x => x.classList.contains('active'));
    if (selected) {
      const selectedIndex = this._optionDoms?.indexOf(selected);
      if (selectedIndex === 0) {
        this.selectOption(this._optionDoms!.length - 1);
      } else {
        this.selectOption(selectedIndex! - 1);
      }
    } else {
      this.selectOption(this._optionDoms!.length - 1);
    }
  }

  private selectOption(selectIndex: number) {
    this._optionDoms = this._optionDoms || [];
    if (this._optionDoms.length === 0 || selectIndex > this._optionDoms.length) {
      this._currentActiveItem = undefined;
      return;
    }
    this._optionDoms.forEach(item => item.classList.remove('active'));
    this._optionDoms[selectIndex].classList.add('active');
    window.requestAnimationFrame(() => {
      this._optionDoms![selectIndex].scrollIntoView(false);
    });
    this._currentActiveItem = {
      value: this._optionDoms[selectIndex].getAttribute('data-value')!,
      displayName: this._optionDoms[selectIndex].getAttribute('data-displayName')!,
    };
  }
}

import React, { useState } from 'react'
import { connect } from 'react-redux'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Switch, Select, Tooltip, Slider, Input, Collapse, Radio } from 'antd'
import classNames from 'classnames'
import { debounce } from 'lodash'
import style from './style.module.scss'

const mapStateToProps = ({ settings }) => ({
  isSidebarOpen: settings.isSidebarOpen,
  isMenuCollapsed: settings.isMenuCollapsed,
  isMenuShadow: settings.isMenuShadow,
  isMenuUnfixed: settings.isMenuUnfixed,
  menuLayoutType: settings.menuLayoutType,
  menuColor: settings.menuColor,
  authPagesColor: settings.authPagesColor,
  isAuthTopbar: settings.isAuthTopbar,
  isTopbarFixed: settings.isTopbarFixed,
  isTopbarSeparated: settings.isTopbarSeparated,
  isContentMaxWidth: settings.isContentMaxWidth,
  isAppMaxWidth: settings.isAppMaxWidth,
  isGrayBackground: settings.isGrayBackground,
  isGrayTopbar: settings.isGrayTopbar,
  isCardShadow: settings.isCardShadow,
  isSquaredBorders: settings.isSquaredBorders,
  isBorderless: settings.isBorderless,
  routerAnimation: settings.routerAnimation,
  locale: settings.locale,
  theme: settings.theme,
  primaryColor: settings.primaryColor,
  leftMenuWidth: settings.leftMenuWidth,
  logo: settings.logo,
  layoutMenu: settings.layoutMenu,
  flyoutMenuColor: settings.flyoutMenuColor,
  layoutBreadcrumbs: settings.layoutBreadcrumbs,
  layoutFooter: settings.layoutFooter,
  layoutTopbar: settings.layoutTopbar,
  version: settings.version,
  flyoutMenuType: settings.flyoutMenuType,
  isPreselectedOpen: settings.isPreselectedOpen,
})

const Sidebar = ({
  dispatch,
  isSidebarOpen,
  isMenuCollapsed,
  isMenuShadow,
  isMenuUnfixed,
  menuLayoutType,
  menuColor,
  authPagesColor,
  isAuthTopbar,
  isTopbarFixed,
  isTopbarSeparated,
  isContentMaxWidth,
  isAppMaxWidth,
  isGrayBackground,
  isGrayTopbar,
  isCardShadow,
  isSquaredBorders,
  isBorderless,
  routerAnimation,
  locale,
  theme,
  primaryColor,
  leftMenuWidth,
  logo,
  layoutMenu,
  flyoutMenuColor,
  layoutBreadcrumbs,
  layoutFooter,
  layoutTopbar,
  version,
  flyoutMenuType,
  isPreselectedOpen,
}) => {
  const [defaultColor] = useState('#4b7cf3')

  const changeSetting = (setting, value) => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting,
        value,
      },
    })
  }

  const toggleSettings = (e) => {
    e.preventDefault()
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isSidebarOpen',
        value: !isSidebarOpen,
      },
    })
  }

  const togglePreselectedThemes = (e) => {
    e.preventDefault()
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isPreselectedOpen',
        value: !isPreselectedOpen,
      },
    })
  }

  const selectColor = debounce((color) => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'primaryColor',
        value: color,
      },
    })
  }, 200)

  const resetColor = () => {
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'primaryColor',
        value: defaultColor,
      },
    })
  }

  const colorPickerHandler = (e, setting, value) => {
    e.preventDefault()
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting,
        value,
      },
    })
  }

  const ColorPicker = ({ colors, value, setting }) => {
    return (
      <div className="clearfix">
        {colors.map((item) => {
          return (
            <a
              href="#"
              key={item}
              onClick={(e) => colorPickerHandler(e, setting, item)}
              className={classNames(`${style.vb__sidebar__select__item}`, {
                [style.vb__sidebar__select__item__active]: value === item,
                [style.vb__sidebar__select__item__black]: item === 'dark',
                [style.vb__sidebar__select__item__white]: item === 'white',
                [style.vb__sidebar__select__item__gray]: item === 'gray',
                [style.vb__sidebar__select__item__blue]: item === 'blue',
                [style.vb__sidebar__select__item__img]: item === 'image',
              })}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div>
      <div
        className={classNames(style.vb__sidebar, {
          [style.vb__sidebar__toggled]: isSidebarOpen,
        })}
      >
        <PerfectScrollbar>
          <div className={style.vb__sidebar__inner}>
            <a
              href="#"
              className={`fe fe-x ${style.vb__sidebar__close}`}
              onClick={toggleSettings}
            />
            <h5 className="mb-4">
              <strong>Settings</strong>
            </h5>
            <Collapse accordion bordered={false} defaultActiveKey={['1']} onChange={() => {}}>
              <Collapse.Panel header="Application Settings" key="1">
                <div className="pt-2 mb-2">
                  <h6>
                    <strong>Application Name</strong>
                  </h6>
                  <Input
                    value={logo}
                    onChange={(e) => {
                      const { value } = e.target
                      changeSetting('logo', value)
                    }}
                  />
                </div>
                <div className="pt-2 mb-2">
                  <h6>
                    <strong>Router Animation</strong>
                  </h6>
                  <Select
                    defaultValue={routerAnimation}
                    style={{ width: '100%' }}
                    onChange={(value) => changeSetting('routerAnimation', value)}
                  >
                    <Select.Option value="none">None</Select.Option>
                    <Select.Option value="slide-fadein-up">Slide Up</Select.Option>
                    <Select.Option value="slide-fadein-right">Slide Right</Select.Option>
                    <Select.Option value="fadein">Fade In</Select.Option>
                    <Select.Option value="zoom-fadein">Zoom</Select.Option>
                  </Select>
                </div>
                <div className="pt-2 mb-2">
                  <h6>
                    <strong>Internationalization</strong>
                  </h6>
                  <Select
                    style={{ width: '100%' }}
                    value={locale}
                    onChange={(value) => changeSetting('locale', value)}
                  >
                    <Select.Option value="en-US">English (en-US)</Select.Option>
                    <Select.Option value="fr-FR">French (fr-FR)</Select.Option>
                    <Select.Option value="ru-RU">Русский (ru-RU)</Select.Option>
                    <Select.Option value="zh-CN">简体中文 (zh-CN)</Select.Option>
                  </Select>
                </div>
              </Collapse.Panel>
              <Collapse.Panel header="Layout Settings" key="2">
                <div className="pt-2 mb-3">
                  <h6>
                    <strong>Visual Builder Style</strong>
                  </h6>
                  <div className="pt-1 clearfix">
                    <Radio.Group
                      style={{ width: '100%' }}
                      onChange={(e) => {
                        const { value } = e.target
                        changeSetting('version', value)
                      }}
                      defaultValue={version}
                    >
                      <div className="row">
                        <div className="col-6">
                          <div className="mb-2">
                            <Radio value="fluent">Fluent (System Default Font)</Radio>
                          </div>
                          <div className="mb-2">
                            <Radio value="clean">Clean (Mukta Font)</Radio>
                          </div>
                          <div className="mb-2">
                            <Radio value="air">Air (Source Sans Font)</Radio>
                          </div>
                        </div>
                      </div>
                    </Radio.Group>
                  </div>
                </div>
                <div className="pt-2 mb-2">
                  <div className="row">
                    <div className="col-auto mr-auto">
                      <h6>
                        <strong>Dark Theme</strong>
                      </h6>
                    </div>
                    <div className="col-auto">
                      <div className={style.vb__sidebar__fixSwitch}>
                        <Switch
                          checked={theme === 'dark'}
                          onChange={(value) => changeSetting('theme', value ? 'dark' : 'default')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-2 mb-2">
                  <div className="row">
                    <div className="col-auto mr-auto">
                      <h6>
                        <strong>Content Max-Width</strong>
                      </h6>
                    </div>
                    <div className="col-auto">
                      <div className={style.vb__sidebar__fixSwitch}>
                        <Switch
                          checked={isContentMaxWidth}
                          onChange={(value) => changeSetting('isContentMaxWidth', value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-2 mb-2">
                  <div className="row">
                    <div className="col-auto mr-auto">
                      <h6>
                        <strong>Layout Max-Width</strong>
                      </h6>
                    </div>
                    <div className="col-auto">
                      <div className={style.vb__sidebar__fixSwitch}>
                        <Switch
                          checked={isAppMaxWidth}
                          onChange={(value) => changeSetting('isAppMaxWidth', value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-2 mb-2">
                  <div className="row">
                    <div className="col-auto mr-auto">
                      <h6>
                        <strong>Layout Gray Bg</strong>
                      </h6>
                    </div>
                    <div className="col-auto">
                      <div className={style.vb__sidebar__fixSwitch}>
                        <Switch
                          checked={isGrayBackground}
                          onChange={(value) => changeSetting('isGrayBackground', value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-2 mb-2">
                  <div className="row">
                    <div className="col-auto mr-auto">
                      <h6>
                        <strong>Card Squared Borders</strong>
                      </h6>
                    </div>
                    <div className="col-auto">
                      <div className={style.vb__sidebar__fixSwitch}>
                        <Switch
                          checked={isSquaredBorders}
                          onChange={(value) => changeSetting('isSquaredBorders', value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-2 mb-2">
                  <div className="row">
                    <div className="col-auto mr-auto">
                      <h6>
                        <strong>Card Shadow</strong>
                      </h6>
                    </div>
                    <div className="col-auto">
                      <div className={style.vb__sidebar__fixSwitch}>
                        <Switch
                          checked={isCardShadow}
                          onChange={(value) => changeSetting('isCardShadow', value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-2 mb-2">
                  <div className="row">
                    <div className="col-auto mr-auto">
                      <h6>
                        <strong>Card Borderless</strong>
                      </h6>
                    </div>
                    <div className="col-auto">
                      <div className={style.vb__sidebar__fixSwitch}>
                        <Switch
                          checked={isBorderless}
                          onChange={(value) => changeSetting('isBorderless', value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-2 mb-2">
                  <div className="row">
                    <div className="col-auto mr-auto">
                      <h6>
                        <strong>Auth Layout Topbar</strong>
                      </h6>
                    </div>
                    <div className="col-auto">
                      <div className={style.vb__sidebar__fixSwitch}>
                        <Switch
                          checked={isAuthTopbar}
                          onChange={(value) => changeSetting('isAuthTopbar', value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-3 mb-2">
                  <div className="row">
                    <div className="col-auto mr-auto">
                      <h6>
                        <strong>Auth Layout Bg</strong>
                      </h6>
                    </div>
                    <div className="col-auto">
                      <div className={style.vb__sidebar__fixColorPicker}>
                        <ColorPicker
                          setting="authPagesColor"
                          value={authPagesColor}
                          colors={['white', 'gray', 'image']}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Collapse.Panel>
              <Collapse.Panel header="Menu Settings" key="3">
                <div className="pt-2 mb-2">
                  <h6>
                    <strong>Menu Variant</strong>
                  </h6>
                  <div className="pt-1 clearfix">
                    <Radio.Group
                      style={{ width: '100%' }}
                      onChange={(e) => {
                        const { value } = e.target
                        changeSetting('layoutMenu', value)
                      }}
                      defaultValue={layoutMenu}
                    >
                      <div className="row">
                        <div className="col-6">
                          <div className="mb-2">
                            <Radio value="classic">Classic</Radio>
                          </div>
                          <div className="mb-2">
                            <Radio value="flyout">Flyout</Radio>
                          </div>
                          <div className="mb-2">
                            <Radio value="simply">Simply</Radio>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="mb-2">
                            <Radio value="noMenu">None</Radio>
                          </div>
                        </div>
                      </div>
                    </Radio.Group>
                  </div>
                </div>
                {(layoutMenu === 'classic' || layoutMenu === 'flyout') && (
                  <div>
                    <div className="pt-2 mb-2">
                      <h6>
                        <strong>Menu Layout Type</strong>
                      </h6>
                      <div className="pt-1 clearfix">
                        <Radio.Group
                          style={{ width: '100%' }}
                          onChange={(e) => {
                            const { value } = e.target
                            changeSetting('menuLayoutType', value)
                          }}
                          defaultValue={menuLayoutType}
                        >
                          <div className="row">
                            <div className="col-6">
                              <div className="mb-2">
                                <Radio value="left">Left</Radio>
                              </div>
                              <div className="mb-2">
                                <Radio value="top">Top</Radio>
                              </div>
                            </div>
                          </div>
                        </Radio.Group>
                      </div>
                    </div>
                    {layoutMenu === 'flyout' && (
                      <div className="pt-2 mb-2">
                        <h6>
                          <strong>Sub Menu Type</strong>
                        </h6>
                        <div className="pt-1 clearfix">
                          <Radio.Group
                            style={{ width: '100%' }}
                            onChange={(e) => {
                              const { value } = e.target
                              changeSetting('flyoutMenuType', value)
                            }}
                            defaultValue={flyoutMenuType}
                          >
                            <div className="row">
                              <div className="col-6">
                                <div className="mb-2">
                                  <Radio value="flyout">Flyout</Radio>
                                </div>
                                <div className="mb-2">
                                  <Radio value="default">Default</Radio>
                                </div>
                                <div className="mb-2">
                                  <Radio value="compact">Compact</Radio>
                                </div>
                              </div>
                            </div>
                          </Radio.Group>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {(layoutMenu === 'classic' ||
                  layoutMenu === 'flyout' ||
                  layoutMenu === 'simply') && (
                  <div>
                    <div className="pt-2 mb-2">
                      <div className="row">
                        <div className="col-auto mr-auto">
                          <h6>
                            <strong>Menu Color</strong>
                          </h6>
                        </div>
                        <div className="col-auto">
                          <div className={style.vb__sidebar__fixColorPicker}>
                            <ColorPicker
                              setting="menuColor"
                              value={menuColor}
                              colors={['white', 'gray', 'dark']}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {layoutMenu === 'flyout' && (
                  <div>
                    {(flyoutMenuType === 'flyout' || flyoutMenuType === 'compact') && (
                      <div className="pt-2 mb-2">
                        <div className="row">
                          <div className="col-auto mr-auto">
                            <h6>
                              <strong>Flyout Color</strong>
                            </h6>
                          </div>
                          <div className="col-auto">
                            <div className={style.vb__sidebar__fixColorPicker}>
                              <ColorPicker
                                setting="flyoutMenuColor"
                                value={flyoutMenuColor}
                                colors={['white', 'gray', 'dark', 'blue']}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {(layoutMenu === 'classic' || layoutMenu === 'flyout') && (
                  <div>
                    <div className="pt-2 mb-2">
                      <div className="row">
                        <div className="col-auto mr-auto">
                          <h6>
                            <strong>Menu Collapsed</strong>
                          </h6>
                        </div>
                        <div className="col-auto">
                          <div className={style.vb__sidebar__fixSwitch}>
                            <Switch
                              checked={isMenuCollapsed}
                              onChange={(value) => changeSetting('isMenuCollapsed', value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pt-2 mb-2">
                      <div className="row">
                        <div className="col-auto mr-auto">
                          <h6>
                            <strong>Menu Unfixed</strong>
                          </h6>
                        </div>
                        <div className="col-auto">
                          <div className={style.vb__sidebar__fixSwitch}>
                            <Switch
                              checked={isMenuUnfixed}
                              onChange={(value) => changeSetting('isMenuUnfixed', value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pt-2 mb-2">
                      <div className="row">
                        <div className="col-auto mr-auto">
                          <h6>
                            <strong>Menu Shadow</strong>
                          </h6>
                        </div>
                        <div className="col-auto">
                          <div className={style.vb__sidebar__fixSwitch}>
                            <Switch
                              checked={isMenuShadow}
                              onChange={(value) => changeSetting('isMenuShadow', value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {menuLayoutType === 'left' && (
                      <div className="pt-2 mb-2">
                        <h6>
                          <strong>Menu Width</strong>
                        </h6>
                        <div className="pt-1 clearfix">
                          <Slider
                            value={leftMenuWidth}
                            min={256}
                            max={330}
                            onChange={(value) => changeSetting('leftMenuWidth', value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Collapse.Panel>
              <Collapse.Panel header="Topbar Settings" key="4">
                <div className="pt-2 mb-2">
                  <h6>
                    <strong>Topbar Variant</strong>
                  </h6>
                  <Radio.Group
                    style={{ width: '100%' }}
                    onChange={(e) => {
                      const { value } = e.target
                      changeSetting('layoutTopbar', value)
                    }}
                    defaultValue={layoutTopbar}
                  >
                    <div className="row">
                      <div className="col-6">
                        <div className="mb-2">
                          <Radio value="v1">Variant 1</Radio>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="mb-2">
                          <Radio value="none">None</Radio>
                        </div>
                      </div>
                    </div>
                  </Radio.Group>
                </div>
                <div className="pt-2 mb-2">
                  <div className="row">
                    <div className="col-auto mr-auto">
                      <h6>
                        <strong>Topbar Separated</strong>
                      </h6>
                    </div>
                    <div className="col-auto">
                      <div className={style.vb__sidebar__fixSwitch}>
                        <Switch
                          checked={isTopbarSeparated}
                          onChange={(value) => changeSetting('isTopbarSeparated', value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-2 mb-2">
                  <div className="row">
                    <div className="col-auto mr-auto">
                      <h6>
                        <strong>Topbar Fixed</strong>
                      </h6>
                    </div>
                    <div className="col-auto">
                      <div className={style.vb__sidebar__fixSwitch}>
                        <Switch
                          checked={isTopbarFixed}
                          onChange={(value) => changeSetting('isTopbarFixed', value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-2 mb-2">
                  <div className="row">
                    <div className="col-auto mr-auto">
                      <h6>
                        <strong>Topbar Gray Bg</strong>
                      </h6>
                    </div>
                    <div className="col-auto">
                      <div className={style.vb__sidebar__fixSwitch}>
                        <Switch
                          checked={isGrayTopbar}
                          onChange={(value) => changeSetting('isGrayTopbar', value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Collapse.Panel>
              <Collapse.Panel header="Breadcrumbs Settings" key="5">
                <div className="pt-2 mb-2">
                  <h6>
                    <strong>Breadcrumbs Variant</strong>
                  </h6>
                  <Radio.Group
                    style={{ width: '100%' }}
                    onChange={(e) => {
                      const { value } = e.target
                      changeSetting('layoutBreadcrumbs', value)
                    }}
                    defaultValue={layoutBreadcrumbs}
                  >
                    <div className="row">
                      <div className="col-6">
                        <div className="mb-2">
                          <Radio value="v1">Variant 1</Radio>
                        </div>
                        <div className="mb-2">
                          <Radio value="v2">Variant 2</Radio>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="mb-2">
                          <Radio value="noBreadcrumbs">None</Radio>
                        </div>
                      </div>
                    </div>
                  </Radio.Group>
                </div>
              </Collapse.Panel>
              <Collapse.Panel header="Footer Settings" key="6">
                <div className="pt-2 mb-1">
                  <h6>
                    <strong>Footer Variant</strong>
                  </h6>
                  <Radio.Group
                    style={{ width: '100%' }}
                    onChange={(e) => {
                      const { value } = e.target
                      changeSetting('layoutFooter', value)
                    }}
                    defaultValue={layoutFooter}
                  >
                    <div className="row">
                      <div className="col-6">
                        <div className="mb-2">
                          <Radio value="v1">Variant 1</Radio>
                        </div>
                        <div className="mb-2">
                          <Radio value="v2">Variant 2</Radio>
                        </div>
                        <div className="mb-2">
                          <Radio value="v3">Variant 3</Radio>
                        </div>
                        <div className="mb-2">
                          <Radio value="v4">Variant 4</Radio>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="mb-2">
                          <Radio value="noFooter">None</Radio>
                        </div>
                      </div>
                    </div>
                  </Radio.Group>
                </div>
              </Collapse.Panel>
            </Collapse>
          </div>
        </PerfectScrollbar>
      </div>
      <div className="vb__utils__sidebar__buttons">
        <Tooltip title="Try Visual Builder" placement="left">
          <a
            href="https://visualbuilder.cloud"
            target="_blank"
            rel="noopener noreferrer"
            className="tour-1 vb__utils__sidebar__button t-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              version="1.1"
              height="24px"
              width="24px"
            >
              <g>
                <path
                  fill="#4b7cf3"
                  strokeWidth="1"
                  stroke="#4b7cf3"
                  d="M12,10.9c-0.1,0-0.2,0-0.2-0.1L3.5,6.1C3.4,6,3.3,5.8,3.3,5.6c0-0.2,0.1-0.3,0.2-0.4l8.2-4.7c0.2-0.1,0.3-0.1,0.5,0      l8.2,4.7c0.2,0.1,0.2,0.3,0.2,0.4S20.6,6,20.5,6.1l-8.2,4.7C12.2,10.8,12.1,10.9,12,10.9z M4.8,5.6L12,9.8l7.2-4.2L12,1.5      L4.8,5.6z"
                />
                <path
                  fill="#4b7cf3"
                  strokeWidth="1"
                  stroke="#4b7cf3"
                  d="M13.6,23.6c-0.1,0-0.2,0-0.2-0.1c-0.2-0.1-0.2-0.3-0.2-0.4v-9.5c0-0.2,0.1-0.3,0.2-0.4l8.2-4.7c0.2-0.1,0.3-0.1,0.5,0      c0.2,0.1,0.2,0.3,0.2,0.4v9.5c0,0.2-0.1,0.3-0.3,0.4l-8.2,4.7C13.8,23.6,13.7,23.6,13.6,23.6z M14.1,13.9v8.3l7.2-4.2V9.8      L14.1,13.9z"
                />
                <path
                  fill="#4b7cf3"
                  strokeWidth="1"
                  stroke="#4b7cf3"
                  d="M10.4,23.6c-0.1,0-0.2,0-0.2-0.1l-8.2-4.7c-0.2-0.1-0.3-0.3-0.3-0.4V8.9c0-0.2,0.1-0.3,0.2-0.4c0.2-0.1,0.3-0.1,0.5,0      l8.2,4.7c0.2,0.1,0.2,0.3,0.2,0.4v9.5c0,0.2-0.1,0.3-0.2,0.4C10.5,23.6,10.5,23.6,10.4,23.6z M2.7,18.1l7.2,4.2v-8.3L2.7,9.8      V18.1z"
                />
              </g>
            </svg>
          </a>
        </Tooltip>
        <Tooltip title="Settings" placement="left">
          <a
            role="button"
            tabIndex="0"
            onKeyPress={toggleSettings}
            onClick={toggleSettings}
            className="tour-1 vb__utils__sidebar__button t-2"
          >
            <i className="fe fe-settings" />
          </a>
        </Tooltip>
        <Tooltip title="Pre-Configured Layouts" placement="left">
          <a
            role="button"
            tabIndex="0"
            onKeyPress={togglePreselectedThemes}
            onClick={togglePreselectedThemes}
            className="tour-2 vb__utils__sidebar__button t-3"
          >
            <i className="fe fe-image" />
          </a>
        </Tooltip>
        <Tooltip title="Switch Dark / Light Theme" placement="left">
          <a
            role="button"
            tabIndex="0"
            onKeyPress={() => changeSetting('theme', theme === 'default' ? 'dark' : 'default')}
            onClick={() => changeSetting('theme', theme === 'default' ? 'dark' : 'default')}
            className="vb__utils__sidebar__button t-4"
          >
            {theme === 'default' && <i className="fe fe-moon" />}
            {theme !== 'default' && <i className="fe fe-sun" />}
          </a>
        </Tooltip>
        <Tooltip title="Set Primary Color" placement="left">
          <a
            className={classNames(
              `vb__utils__sidebar__button vb__utils__sidebar__button__color t-5`,
              {
                vb__utils__sidebar__button__color__reset: primaryColor === defaultColor,
              },
            )}
          >
            <button type="button" tabIndex="0" onKeyPress={resetColor} onClick={resetColor}>
              <i className="fe fe-x-circle" />
            </button>
            <input
              type="color"
              id="colorPicker"
              onChange={(e) => selectColor(e.target.value)}
              value={primaryColor}
            />
            <i className="fe fe-package" />
          </a>
        </Tooltip>
        <Tooltip title="Documentation" placement="left">
          <a
            href="https://docs.visualbuilder.cloud"
            target="_blank"
            rel="noopener noreferrer"
            className="vb__utils__sidebar__button t-6"
          >
            <i className="fe fe-book-open" />
          </a>
        </Tooltip>
      </div>
    </div>
  )
}

export default connect(mapStateToProps)(Sidebar)

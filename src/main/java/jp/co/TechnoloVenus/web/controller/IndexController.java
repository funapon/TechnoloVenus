package jp.co.TechnoloVenus.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * インデックスページのURLを定義するクラス
 */
@Controller
public class IndexController {
	/**
	 * indexページのhtmlファイル名を返すメソッド
	 * @return htmlファイル名
	 */
	@GetMapping("/")
	public String goIndex() {
		return "index";
	}
}

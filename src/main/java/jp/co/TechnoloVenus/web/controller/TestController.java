package jp.co.TechnoloVenus.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * testページのURLを定義するクラス
 */
@Controller
public class TestController {
	/**
	 * testページのhtmlファイル名を返すメソッド
	 * @return htmlファイル名
	 */
	@GetMapping("/testpage")
	public String goTestPage() {
		return "test_page";
	}
}
